import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChildAccount} from "./child-account.entity";
import {In, Repository} from "typeorm";
import {RedisService} from "../../../redis/redis.service";
import {AccountsService} from "../accounts.service";
import {FamilyService} from "../../../family/family.service";
import {ChildAccountDTO, UpdateChildAccountDTO} from "./child-account.dto";
import {FamilyCacheService} from "../../../family/family-cache.service";
import {TransactionsService} from "../transactions/transactions.service";
import {DepositDTO} from "../transactions/transaction.dto";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../common/events/cache-invalidate.event";
import {FamilyAccountsService} from "../../../family/family-accounts/family-accounts.service";
import {extractIds} from "../accounts.mappers";

@Injectable()
export class ChildAccountsService {
    private baseKey = "child-accounts";

    public constructor(
        @InjectRepository(ChildAccount)
        private readonly childAccountRepository: Repository<ChildAccount>,
        private readonly redisService: RedisService,
        private readonly accountsService: AccountsService,
        private readonly familyAccountsService: FamilyAccountsService,
        private readonly transactionsService: TransactionsService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
    ) {
    }

    public async getChildAccounts(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 3600, async () => {
            const accountIds = extractIds(await this.familyAccountsService.getAccounts(userId));

            const childAccounts = await this.childAccountRepository.find({
                where: {
                    user: {id: In([userId, memberId])},
                    id: In(accountIds),
                },
                relations: ["user"],
            });

            const accountWithBalance = async (childAccount: ChildAccount) => {
                return {
                    ...childAccount,
                    user: {id: childAccount.user.id},
                    balance: await this.accountsService.getBalance(childAccount.id, childAccount.bankId, childAccount.user.id)
                };
            }

            return Promise.all(childAccounts.map(accountWithBalance));
        });
    }

    public async createChildAccount(userId: number, childAccountDTO: ChildAccountDTO) {
        const account = await this.accountsService.createAccount(userId, childAccountDTO.bankId, {type: "checking"});

        const childAccount = this.childAccountRepository.create({
            ...childAccountDTO,
            id: account.accountId,
            account: account.account_number,
            user: {id: userId}
        });
        await this.childAccountRepository.save(childAccount);

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return {...childAccount, balance: 0};
    }

    public async deleteChildAccount(userId: number, childAccountId: string) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const childAccount = await this.findChildAccount(childAccountId, userId, partnerId);

        const account = await this.accountsService.closeAccount(childAccount.user.id, childAccount.bankId, childAccountId, {action: "transfer"});
        if (account.status === "closed") {
            await this.childAccountRepository.remove(childAccount);

            await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);
        }
    }

    public async updateChildAccount(userId: number, childAccountId: string, updateChildAccountDTO: UpdateChildAccountDTO) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const childAccount = await this.findChildAccount(childAccountId, userId, partnerId);

        const updatedChildAccount = Object.assign(childAccount, updateChildAccountDTO);
        await this.childAccountRepository.save(updatedChildAccount);

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return updatedChildAccount;
    }

    public async depositChildAccount(userId: number, childAccountId: string, depositDTO: DepositDTO) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const childAccount = await this.findChildAccount(childAccountId, userId, partnerId);

        const transaction = await this.transactionsService.createTransaction(userId, {
            fromAccountId: depositDTO.fromAccountId,
            fromAccount: depositDTO.fromAccount,
            amount: depositDTO.amount,
            toAccountId: childAccountId,
            toAccount: childAccount.account,
            fromBank: depositDTO.fromBank,
            toBank: childAccount.bankId,
            comment: "Перевод на детский счет",
        });

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return childAccount;
    }

    private async findChildAccount(childAccountId: string, userId: number, partnerId?: number) {
        const childAccount = await this.childAccountRepository.findOne({
            where: {
                user: {id: In([userId, partnerId])},
                id: childAccountId
            },
            relations: ["user"]
        });

        if (!childAccount) {
            throw new NotFoundException("Детский счет не найден");
        }

        return childAccount;
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    @OnEvent('cache.invalidate.accounts', {async: true})
    private async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
