import {Injectable} from '@nestjs/common';
import {TransactionsService} from "../transactions.service";
import {RedisService} from "../../../../redis/redis.service";
import {CategoriesConfig} from "./categories.config";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../../common/events/cache-invalidate.event";

@Injectable()
export class CategoriesService {
    private baseKey = "transaction-categories";

    public constructor(
        private readonly transactionService: TransactionsService,
        private readonly redisService: RedisService,
    ) {
    }

    public async getCategories(userId: number) {
        return this.redisService.withCache(`${this.baseKey}:${userId}`, 300, async () => {
            const categories = Object.fromEntries(Object.keys(CategoriesConfig).map(id => ([id, {
                name: CategoriesConfig[id].name,
                spent: 0
            }])));

            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - 1);

            const transactions = await this.transactionService.getTransactions(userId);
            transactions.forEach((transaction) => {
                if (transaction.date > fromDate && transaction.outcome) {
                    categories[transaction.category.id].spent += transaction.value;
                }
            });

            return Object.entries(categories).map(([categoryId, category]) => ({
                ...category,
                id: categoryId,
                spent: Math.floor(category.spent)
            }));
        });
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache(this.baseKey, userId);
    }
}
