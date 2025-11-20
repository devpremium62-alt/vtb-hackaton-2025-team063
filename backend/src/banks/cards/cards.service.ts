import {Injectable} from '@nestjs/common';
import {RedisService} from "../../redis/redis.service";
import {ConsentsService} from "../consents/consents.service";
import {BanksService} from "../banks.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../common/events/cache-invalidate.event";
import {CardType} from "../banks.types";

@Injectable()
export class CardsService {
    public baseKey = "cards";

    public constructor(
        private readonly redisService: RedisService,
        private readonly consentsService: ConsentsService,
        private readonly banksService: BanksService,
    ) {
    }

    public getCards(userId: number) {
        return this.redisService.withCache(`${this.baseKey}:${userId}`, 300, async () => {
            const consents = await this.consentsService.getUserConsents(userId);

            const cards: Record<string, CardType[]> = {};
            const promises: Promise<any>[] = [];

            for (const consent of consents) {
                promises.push(this.banksService.requestBankAPI<{data: {cards: CardType[]}}>(consent.bankId, {
                        url: `/cards?client_id=${consent.clientId}`,
                        method: "GET",
                        headers: {
                            "X-Consent-Id": consent.consentId,
                        }
                    })
                    .then(res => cards[consent.bankId] = res.data.cards)
                    .catch(e => console.error(e))
                )
            }

            await Promise.all(promises);

            return cards;
        })
    }

    @OnEvent('cache.invalidate.consents', {async: true})
    private async handleConsentsCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache(this.baseKey, userId);
    }
}
