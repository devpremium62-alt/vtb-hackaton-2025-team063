import {HttpService} from '@nestjs/axios';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {lastValueFrom} from "rxjs";
import {BanksConfig} from "./banks.config";
import {AxiosRequestConfig} from "axios";
import {CACHE_POLICY, RedisService} from "../redis/redis.service";
import {BanksQueueService} from "./banks-queue.service";

@Injectable()
export class BanksService {
    private tokens: Record<string, { token: string; expiresAt: number }> = {};

    constructor(private readonly httpService: HttpService,
                private readonly redisService: RedisService,
                private readonly banksQueueService: BanksQueueService)
    {}

    public async requestBankAPI<T>(bankKey: string, requestConfig: AxiosRequestConfig, cacheKey?: string | null, dontCache = CACHE_POLICY.CACHE) {
        const token = await this.getAccessToken(bankKey);

        const bank = BanksConfig[bankKey];

        return this.errorHandledRequest(async () => {
            const url = `${bank.baseUrl}${requestConfig.url}`;
            const key = cacheKey || `${url}:${process.env.CLIENT_ID}:${requestConfig.headers?["X-Consent-Id"] : ""}`;

            return this.redisService.withCache<T>(key, 300, async () => {
                const job = await this.banksQueueService.addJob(url, token, bankKey, requestConfig);
                const result = await job.waitUntilFinished(this.banksQueueService.events);

                return result as T;
            }, () => requestConfig.method === "GET" && dontCache !== CACHE_POLICY.DONT_CACHE);
        });
    }

    private async getAccessToken(bankKey: string) {
        const bank = BanksConfig[bankKey];

        const now = Date.now();
        const cached = this.tokens[bankKey];
        if (cached && cached.expiresAt > now) {
            return cached.token;
        }

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        return this.errorHandledRequest(async () => {
            const res = await lastValueFrom(
                this.httpService.post(`${bank.baseUrl}/auth/bank-token?client_id=${clientId}&client_secret=${clientSecret}`),
            );

            this.tokens[bankKey] = {
                token: res.data.access_token,
                expiresAt: now + res.data.expires_in * 1000 - 5000,
            };

            return this.tokens[bankKey].token;
        })
    }

    private async errorHandledRequest<T>(callback: () => Promise<T>) {
        try {
            return await callback();
        } catch (err) {
            console.error("Error:", err.request.path, err.message);

            if (err.response?.data) {
                throw new HttpException(
                    `Ошибка API банка: ${JSON.stringify(err.response.data)}`,
                    err.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                `Ошибка при получении токена: ${err.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
