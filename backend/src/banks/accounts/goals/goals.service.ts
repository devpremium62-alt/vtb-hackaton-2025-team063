import {Injectable, NotFoundException} from '@nestjs/common';
import {RedisService} from "../../../redis/redis.service";
import {FamilyService} from "../../../family/family.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Goal} from "./goal.entity";
import {In, Repository} from "typeorm";
import {AccountsService} from "../accounts.service";
import {GoalDTO} from "./goal.dto";
import {FamilyCacheService} from "../../../family/family-cache.service";
import {TransactionsService} from "../transactions/transactions.service";
import {DepositDTO} from "../transactions/transaction.dto";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../common/events/cache-invalidate.event";
import {FamilyAccountsService} from "../../../family/family-accounts/family-accounts.service";
import {extractIds} from "../accounts.mappers";

@Injectable()
export class GoalsService {
    private baseKey = "goals";

    public constructor(
        @InjectRepository(Goal)
        private readonly goalsRepository: Repository<Goal>,
        private readonly redisService: RedisService,
        private readonly accountsService: AccountsService,
        private readonly familyAccountsService: FamilyAccountsService,
        private readonly transactionsService: TransactionsService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
    ) {
    }

    public async getGoals(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 3600, async () => {
            const accountIds = extractIds(await this.familyAccountsService.getAccounts(userId));

            const goals = await this.goalsRepository.find({
                where: {
                    id: In(accountIds),
                    user: {id: In([userId, memberId])}
                },
                relations: ["user"]
            });

            return await Promise.all(goals.map(async goal => {
                const balance = await this.accountsService.getBalance(goal.id, goal.bankId, goal.user.id);
                return {...goal, collected: balance};
            }));
        });
    }

    public async createGoal(userId: number, goalDTO: GoalDTO) {
        const account = await this.accountsService.createAccount(userId, goalDTO.bankId, {type: "savings"});

        const goal = this.goalsRepository.create({
            ...goalDTO,
            user: {id: userId},
            id: account.accountId,
            account: account.account_number
        });
        await this.goalsRepository.save(goal);

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return {...goal, collected: 0};
    }

    public async deleteGoal(userId: number, goalId: string) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const goal = await this.findGoal(goalId, userId, memberId);

        const account = await this.accountsService.closeAccount(userId, goal.bankId, goalId, {action: "transfer"});
        if (account.status === "closed") {
            await this.goalsRepository.remove(goal);

            await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);
        }
    }

    public async depositGoal(userId: number, goalId: string, depositDTO: DepositDTO) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const goal = await this.findGoal(goalId, userId, memberId);
        const accountHolder = await this.familyAccountsService.getAccountHolder(depositDTO.fromBank, depositDTO.fromAccountId, userId, memberId);

        await this.transactionsService.createTransaction(accountHolder, {
            fromAccountId: depositDTO.fromAccountId,
            fromAccount: depositDTO.fromAccount,
            amount: depositDTO.amount,
            toAccountId: goalId,
            toAccount: goal.account,
            fromBank: depositDTO.fromBank,
            toBank: goal.bankId,
            comment: "Перевод на счет финансовой цели",
        });

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId);

        return goal;
    }

    private async findGoal(goalId: string, userId: number, memberId?: number) {
        const goal = await this.goalsRepository.findOne({where: {user: {id: In([userId, memberId])}, id: goalId}});
        if (!goal) {
            throw new NotFoundException("Финансовая цель не найдена");
        }

        return goal;
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    @OnEvent('cache.invalidate.accounts', {async: true})
    private async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
