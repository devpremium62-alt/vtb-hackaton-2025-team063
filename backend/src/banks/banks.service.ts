import {HttpService} from '@nestjs/axios';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {lastValueFrom} from "rxjs";
import {BanksConfig} from "./banks.config";
import {ConfigService} from "@nestjs/config";
import {AxiosRequestConfig} from "axios";

@Injectable()
export class BanksService {
    private tokens: Record<string, { token: string; expiresAt: number }> = {};

    constructor(private readonly httpService: HttpService,
                private readonly configService: ConfigService) {
    }

    public async requestBankAPI<T>(bankKey: string, requestConfig: AxiosRequestConfig) {
        const token = await this.getAccessToken(bankKey);
        const bank = BanksConfig[bankKey];

        const clientId = this.configService.get<string>("CLIENT_ID");

        return this.errorHandledRequest(async () => {
            const response = await lastValueFrom(
                this.httpService.request({
                    ...requestConfig,
                    url: `${bank.baseUrl}${requestConfig.url}`,
                    headers: {
                        ...requestConfig.headers,
                        Authorization: `Bearer ${token}`,
                        "X-Requesting-Bank": clientId,
                        'Content-Type': 'application/json',
                    },
                }),
            );

            return response.data as T;
        });
    }

    private async getAccessToken(bankKey: string) {
        const bank = BanksConfig[bankKey];

        const now = Date.now();
        const cached = this.tokens[bankKey];
        if (cached && cached.expiresAt > now) {
            return cached.token;
        }

        const clientId = this.configService.get<string>("CLIENT_ID");
        const clientSecret = this.configService.get<string>("CLIENT_SECRET");

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
