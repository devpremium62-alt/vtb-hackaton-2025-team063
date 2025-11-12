import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";
import {EventEmitter2} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../common/events/cache-invalidate.event";

@Injectable()
export class RedisService {
    public constructor(
        @Inject('REDIS_CLIENT') public readonly redis: Redis,
        private readonly emitter: EventEmitter2
    ) {
    }

    public async withCache<T>(key: string, ttl: number, callback: () => Promise<T>, useCache = () => true) {
        if (useCache()) {
            const data = await this.redis.get(key);
            if (data) {
                return JSON.parse(data) as T;
            }
        }

        const response = await callback();
        if (useCache()) {
            await this.redis.set(key, JSON.stringify(response), "EX", ttl);
        }

        return response;
    }

    public async invalidateCache(keyBase: string, ...entitiesId: (null | number | string)[]) {
        const pattern = `${keyBase}:${entitiesId.join(":")}`;

        if (pattern.includes('*')) {
            const stream = this.redis.scanStream({
                match: pattern,
                count: 100,
            });

            const keysToDelete: string[] = [];
            for await (const keys of stream) {
                if (keys.length) keysToDelete.push(...keys);
            }

            if (keysToDelete.length > 0) {
                await this.redis.del(...keysToDelete);
            }
        } else {
            await this.redis.del(pattern);
        }

        this.emitter.emit(`cache.invalidate.${keyBase}`, new CacheInvalidateEvent(...entitiesId));
    }
}
