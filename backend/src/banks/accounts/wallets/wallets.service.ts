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
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../common/events/cache-invalidate.event";
import {FamilyAccountsService} from "../../../family/family-accounts/family-accounts.service";
import {extractIds} from "../accounts.mappers";
import {NotificationsService} from "../../../notifications/notifications.service";

type WalletWithBalance = Wallet & { currentAmount: number };

@Injectable()
export class WalletsService {
    private baseKey = "wallets";

    public constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        private readonly accountsService: AccountsService,
        private readonly transactionsService: TransactionsService,
        private readonly familyAccountsService: FamilyAccountsService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
        private readonly redisService: RedisService,
        private readonly notificationsService: NotificationsService,
    ) {
    }

    public async getAll(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 300, async () => {
            const accountIds = extractIds(await this.familyAccountsService.getAccounts(userId));

            const wallets = await this.walletRepository.find({
                where: {
                    id: In(accountIds),
                    user: {id: In([userId, memberId])}
                }
            }) as WalletWithBalance[];

            const promises: Promise<any>[] = [];
            for (const wallet of wallets) {
                wallet.currentAmount = 0;
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
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const resWallet = wallet || await this.findWallet(walletId, userId, memberId);

        const balance = await this.accountsService.getBalance(resWallet.account, resWallet.bankId, resWallet.user.id);

        const transaction = await this.transactionsService.createTransaction(resWallet.user.id, {
            fromAccountId: depositDTO.fromAccountId,
            fromAccount: depositDTO.fromAccount,
            amount: depositDTO.amount,
            toAccountId: walletId,
            toAccount: resWallet.account,
            fromBank: depositDTO.fromBank,
            toBank: resWallet.bankId,
            comment: "Перевод на счет кошелька",
        });

        const remains = Math.round(balance - depositDTO.amount);
        const usedPercent = Math.round((remains) / resWallet.amount * 100);
        if (usedPercent >= 100) {
            await this.notificationsService.sendNotification("Лимит кошелька исчерпан", `На кошельке "${resWallet.name}" закончились средства`, userId, memberId);
        } else if(usedPercent >= 90) {
            await this.notificationsService.sendNotification("Средства на кошельке подходят к концу", `На кошельке "${resWallet.name}" осталось ${remains}₽`, userId, memberId);
        }

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return resWallet;
    }

    public async deleteWallet(userId: number, walletId: string) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const wallet = await this.findWallet(walletId, userId, memberId);

        const account = await this.accountsService.closeAccount(wallet.user.id, wallet.bankId, walletId, {action: "transfer"});
        if (account.status === "closed") {
            await this.walletRepository.remove(wallet);

            await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);
        }
    }

    private async findWallet(walletId: string, userId: number, memberId?: number) {
        const wallet = await this.walletRepository.findOne({
            where: {user: {id: In([userId, memberId])}, id: walletId},
            relations: ["user"]
        });

        if (!wallet) {
            throw new NotFoundException("Кошелек не найден");
        }

        return wallet;
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    @OnEvent('cache.invalidate.accounts', {async: true})
    private async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
