import {Injectable} from '@nestjs/common';
import {RedisService} from "../redis/redis.service";
import {FamilyService} from "./family.service";

@Injectable()
export class FamilyCacheService {
    public constructor(
        private readonly redisService: RedisService,
        private readonly familyService: FamilyService) {
    }

    public getFamilyKey(userId: number, partnerId?: number) {
        return [userId, partnerId].filter(Boolean).sort().join(":");
    }

    public async invalidateFamilyCache(baseKey: string, userId: number | string) {
        if(userId === "*") {
            return;
        }

        const memberId = await this.familyService.getFamilyMemberId(userId as number);
        const familyKey = this.getFamilyKey(userId as number, memberId);
        await this.redisService.invalidateCache(baseKey, familyKey);
    }
}
