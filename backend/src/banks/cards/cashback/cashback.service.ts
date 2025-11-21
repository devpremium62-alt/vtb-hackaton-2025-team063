import {Injectable} from '@nestjs/common';
import {CardsService} from "../cards.service";
import {RedisService} from "../../../redis/redis.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../common/events/cache-invalidate.event";
import {CategoriesConfig} from "../../accounts/transactions/categories/categories.config";
import {getRandomDate, getRandomInt} from "../../../utils";

type Cashback = {
    user: number;
    bank: string;
    card: string;

    cashback: {
        category: number;
        date: Date;
        percents: number;
        cashback: number;
    }[];
}

@Injectable()
export class CashbackService {
    private baseKey = "cashback";

    public constructor(
        private readonly cardsService: CardsService,
        private readonly redisService: RedisService,
    ) {
    }

    public async getCardsCashback(userId: number) {
        return this.redisService.withCache(`${this.baseKey}:${userId}`, 3600, async () => {
            const cards = await this.cardsService.getCards(userId);
            const data: Cashback[] = [];

            const monthFuture = new Date();
            monthFuture.setMonth(monthFuture.getMonth() + 3);

            Object.entries(cards).forEach(([bankKey, bankCards]) => {
                bankCards.forEach(card => {
                    const cashbackCard: Cashback  = {
                        card: card.cardNumber,
                        bank: bankKey,
                        user: userId,
                        cashback: []
                    }

                    for (const category of Object.keys(CategoriesConfig)) {
                        cashbackCard.cashback.push({
                            category: Number(category),
                            date: getRandomDate(new Date(), monthFuture),
                            cashback: getRandomInt(1, 5000),
                            percents: Math.max(getRandomInt(1, 20), 1)
                        })
                    }

                    data.push(cashbackCard);
                });
            });

            return data;
        });
    }

    @OnEvent('cache.invalidate.cards', {async: true})
    private async handleConsentsCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache(this.baseKey, userId);
    }
}
