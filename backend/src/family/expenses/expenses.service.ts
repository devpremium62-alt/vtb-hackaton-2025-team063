import {Injectable} from '@nestjs/common';
import {CategoriesService} from "../../banks/accounts/transactions/categories/categories.service";
import {RedisService} from "../../redis/redis.service";
import {FamilyService} from "../family.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../common/events/cache-invalidate.event";
import {FamilyCacheService} from "../family-cache.service";

@Injectable()
export class ExpensesService {
    private baseKey = "family-expenses";

    public constructor(
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
        private readonly categoriesService: CategoriesService,
        private readonly redisService: RedisService) {
    }

    public async getFamilyExpenses(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 300, async () => {
            const expensesForPerson = async (userId: number) => {
                const categories = await this.categoriesService.getCategories(userId);
                return {
                    expenses: categories.reduce((acc, cat) => acc + cat.spent, 0),
                    categories
                };
            }

            return Promise.all([expensesForPerson(userId), memberId ? expensesForPerson(memberId) : undefined]);
        });
    }

    @OnEvent('cache.invalidate.transaction-categories', {async: true})
    async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
