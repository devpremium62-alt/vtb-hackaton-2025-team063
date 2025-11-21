import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";
import {EventEmitter2} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../common/events/cache-invalidate.event";
import Redlock from "redlock";

export enum CACHE_POLICY {
    CACHE,
    DONT_CACHE
}

@Injectable()
export class RedisService {
    public readonly redlock: Redlock;

    public constructor(
        @Inject('REDIS_CLIENT') public readonly redis: Redis,
        private readonly emitter: EventEmitter2
    ) {
        this.redlock = new Redlock(
            [this.redis],
            {
                driftFactor: 0.01,
                retryCount: 20,
                retryDelay: 150,
                retryJitter: 100,
            }
        );
    }

    public async withLock<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
        const resource = `lock:${key}`;

        const lock = await this.redlock.acquire([resource], ttl);

        try {
            return await callback();
        } finally {
            await lock.release();
        }
    }

    public async withCache<T>(key: string, ttl: number, callback: () => Promise<T>, useCache = (response?: T) => true) {
        if (useCache()) {
            const data = await this.redis.get(key);
            if (data) {
                return JSON.parse(data) as T;
            }
        }

        const response = await callback();
        if (useCache(response) && response && (!Array.isArray(response) || response.length !== 0)) {
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
                if (keys.length) {
                    keysToDelete.push(...keys);
                }
            }

            this.emitter.emit(`cache.invalidate.${keyBase}`, new CacheInvalidateEvent(...entitiesId));
            if (keysToDelete.length > 0) {
                for(const key of keysToDelete) {
                    this.emitter.emit(`cache.invalidate.${keyBase}`, new CacheInvalidateEvent(...key.split(":").slice(1)));
                }

                await this.redis.del(...keysToDelete);
            }
        } else {
            this.emitter.emit(`cache.invalidate.${keyBase}`, new CacheInvalidateEvent(...entitiesId));
            await this.redis.del(pattern);
        }
    }
}
