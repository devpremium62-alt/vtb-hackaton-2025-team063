import { Injectable } from '@nestjs/common';
import {AccountsService} from "../../banks/accounts/accounts.service";
import {FamilyService} from "../family.service";
import {FamilyCacheService} from "../family-cache.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../common/events/cache-invalidate.event";
import {RedisService} from "../../redis/redis.service";

@Injectable()
export class FamilyAccountsService {
    private baseKey = "family-accounts";

    public constructor(
        private readonly accountsService: AccountsService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
        private readonly redisService: RedisService,
    ) {
    }

    public async getAccounts(userId: number) {
        const memberId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, memberId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 3600, async () => {
            const myAccounts = await this.accountsService.getAccounts(userId);

            let memberAccounts = {};
            if(memberId) {
                memberAccounts = await this.accountsService.getAccounts(memberId);
            }

            for (const key in memberAccounts) {
                if (!memberAccounts.hasOwnProperty(key)) {
                    continue;
                }

                if (myAccounts[key]) {
                    myAccounts[key] = myAccounts[key].concat(memberAccounts[key]);
                } else {
                    myAccounts[key] = [...memberAccounts[key]];
                }
            }

            return myAccounts;
        });
    }

    @OnEvent('cache.invalidate.accounts', {async: true})
    private async handleExtendedCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
