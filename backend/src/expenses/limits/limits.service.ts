import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Limit} from "./limit.entity";
import {LimitDTO} from "./limit.dto";
import {RedisService} from "../../redis/redis.service";
import {FamilyCacheService} from "../../family/family-cache.service";
import {FamilyService} from "../../family/family.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../common/events/cache-invalidate.event";
import {TransactionsService} from "../../banks/accounts/transactions/transactions.service";

const DAY_DURATION = 1000 * 60 * 60 * 24;
const WEEK_DURATION = DAY_DURATION * 7;
const MONTH_DURATION = DAY_DURATION * 30;

@Injectable()
export class LimitsService {
    private keyBase = "limits";

    public constructor(
        @InjectRepository(Limit)
        private readonly limitRepository: Repository<Limit>,
        private readonly redisService: RedisService,
        private readonly familyService: FamilyService,
        private readonly transactionsService: TransactionsService,
        private readonly familyCacheService: FamilyCacheService,
    ) {
    }

    public async create(userId: number, limitDTO: LimitDTO) {
        const limit = this.limitRepository.create({...limitDTO, user: {id: userId}});
        await this.limitRepository.save(limit);

        await this.familyCacheService.invalidateFamilyCache(this.keyBase, userId);

        return {...limit, spent: 0};
    }

    public async delete(userId: number, limitId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);

        const removed = await this.limitRepository.delete({id: limitId, user: {id: In([userId, partnerId])}});
        if (!removed.affected || removed.affected === 0) {
            throw new NotFoundException("Лимит для удаления не найден");
        }

        await this.familyCacheService.invalidateFamilyCache(this.keyBase, userId);
    }

    public async getAll(userId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, partnerId);

        return this.redisService.withCache(`${this.keyBase}:${familyKey}`, 3600, async () => {
            let limits = await this.limitRepository.find({where: {user: {id: In([userId, partnerId])}}});
            limits = limits.map(limit => ({...limit, spent: 0}));

            const transactions = await this.transactionsService.getTransactions(userId);

            const categoryToLimits: Record<number, (Limit & { spent?: number })[]> = {};
            for (const limit of limits) {
                if (!categoryToLimits[limit.category]) {
                    categoryToLimits[limit.category] = [limit];
                } else {
                    categoryToLimits[limit.category].push(limit);
                }
            }

            const now = Date.now();
            for (const transaction of transactions) {
                const cat = transaction.category;

                if (!transaction.outcome || !categoryToLimits[cat.id]) {
                    continue;
                }

                for (const limit of categoryToLimits[cat.id]) {

                    const weekMatch = limit.period === "week" && now - transaction.date.getTime() <= WEEK_DURATION;
                    const monthMatch = limit.period === "month" && now - transaction.date.getTime() <= MONTH_DURATION;

                    if (weekMatch || monthMatch) {
                        limit.spent! += transaction.value;
                    }
                }
            }

            return Object.values(categoryToLimits).flat(1).map((l) => ({...l, spent: Math.floor(l.spent!)}));
        });
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [entityId] = event.entityIds;

        await this.redisService.invalidateCache(this.keyBase, entityId);
    }
}
