import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Wallet} from "./wallet.entity";
import {FamilyService} from "../../../family/family.service";
import {FamilyCacheService} from "../../../family/family-cache.service";
import {RedisService} from "../../../redis/redis.service";
import {AccountsService} from "../accounts.service";
import {TransactionsService} from "../transactions/transactions.service";
import {WalletDTO} from "./wallet.dto";
import {DepositDTO} from "../transactions/transaction.dto";
import {use} from "passport";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../common/events/cache-invalidate.event";

@Injectable()
export class WalletsService {
    private baseKey = "wallets";

    public constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        private readonly accountsService: AccountsService,
        private readonly transactionsService: TransactionsService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
        private readonly redisService: RedisService,
    ) {

    }

    public async getAll(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 300, async () => {
            const wallets = await this.walletRepository.find({where: {user: {id: In([userId, memberId])}}}) as (Wallet & {
                currentAmount: number
            })[];
            const promises: Promise<any>[] = [];

            for (const wallet of wallets) {
                promises.push(this.accountsService.getBalance(wallet.id, wallet.bankId, userId)
                    .then(balance => wallet.currentAmount = balance)
                    .catch(err => console.error(err))
                );
            }

            await Promise.all(promises);

            return wallets;
        });
    }

    public async createWallet(userId: number, walletDTO: WalletDTO) {
        const balance = await this.accountsService.getBalance(walletDTO.fromAccountId, walletDTO.fromBank, userId);
        if (balance < walletDTO.amount) {
            throw new BadRequestException("Недостаточно средств для создания кошелька");
        }

        const account = await this.accountsService.createAccount(userId, walletDTO.bankId, {type: "checking"});

        const wallet = this.walletRepository.create({
            ...walletDTO,
            user: {id: userId},
            id: account.accountId,
            account: account.account_number,
        });

        await this.depositWallet(userId, wallet.id, walletDTO, wallet);

        await this.walletRepository.save(wallet);

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return {...wallet, currentAmount: wallet.amount};
    }

    public async depositWallet(userId: number, walletId: string, depositDTO: DepositDTO, wallet?: Wallet) {
        const resWallet = wallet || await this.findWallet(userId, walletId);

        const transaction = await this.transactionsService.createTransaction(userId, {
            fromAccountId: depositDTO.fromAccountId,
            fromAccount: depositDTO.fromAccount,
            amount: depositDTO.amount,
            toAccountId: walletId,
            toAccount: resWallet.account,
            fromBank: depositDTO.fromBank,
            toBank: resWallet.bankId,
            comment: "Перевод на счет кошелька",
        });

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return resWallet;
    }

    public async deleteWallet(userId: number, walletId: string) {
        const wallet = await this.findWallet(userId, walletId);

        const account = await this.accountsService.closeAccount(userId, wallet.bankId, walletId, {action: "transfer"});
        if (account.status === "closed") {
            await this.walletRepository.remove(wallet);

            await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);
        }
    }

    private async findWallet(userId: number, walletId: string) {
        const wallet = await this.walletRepository.findOne({where: {user: {id: userId}, id: walletId}});
        if (!wallet) {
            throw new NotFoundException("Кошелек не найден");
        }

        return wallet;
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    private async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
