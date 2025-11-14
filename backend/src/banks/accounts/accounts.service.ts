import {BadRequestException, Injectable} from '@nestjs/common';
import {BanksService} from "../banks.service";
import {ConsentsService} from "../consents/consents.service";
import {AccountType, CreatedAccountType} from "../banks.types";
import {RedisService} from "../../redis/redis.service";
import {AccountCloseDTO, AccountDTO} from "./account.dto";
import {Consent} from "../consents/consent.entity";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../common/events/cache-invalidate.event";

@Injectable()
export class AccountsService {
    private cacheKey = "accounts";
    private cacheExtendedKey = "accounts-extended";

    public constructor(private readonly banksService: BanksService, private readonly consentsService: ConsentsService, private readonly redisService: RedisService) {
    }

    public async getTotalBalance(userId: number) {
        let totalBalance = 0;

        const accounts = await this.getAccountsForPayments(userId);
        for (const account of Object.values(accounts).flat(1)) {
            totalBalance += account.balance!;
        }

        return Math.round(totalBalance * 100) / 100;
    }

    public async getAccounts(userId: number, onlyEnabled = false) {
        const consents = await this.consentsService.getUserConsents(userId);
        const responses: Record<string, AccountType[]> = {};

        const promises: Promise<any>[] = [];
        for (const consent of consents) {
            promises.push(this.getBankAccounts(userId, consent.bankId, onlyEnabled, consent)
                .then(response => responses[consent.bankId] = response)
                .catch(err => console.error(err)));
        }

        await Promise.all(promises);

        return responses;
    }

    public async getAccountsForPayments(userId: number) {
        return this.redisService.withCache(`${this.cacheExtendedKey}:${userId}`, 300, async () => {
            const accounts: Record<string, (AccountType & {balance?: number})[]> = await this.getAccounts(userId);

            const promises: Promise<any>[] = [];
            for (const bank of Object.keys(accounts)) {
                for (const account of accounts[bank]) {
                    account.balance = 0;

                    promises.push(this.getBalance(account.accountId, bank, userId)
                        .then(balance => account.balance = balance)
                        .catch(err => console.error(err)));
                }
            }

            await Promise.all(promises);

            return accounts;
        });
    }

    private async getBankAccounts(userId: number, bankId: string, onlyEnabled = false, consent?: Consent) {
        const bankConsent = consent || await this.consentsService.getUserBankConsent(bankId, userId);

        const cacheKey = `${this.cacheKey}:${bankConsent.consentId}:${userId}`;
        const bankAccounts = await this.banksService.requestBankAPI<{
            data: { account: AccountType[] }
        }>(bankConsent.bankId, {
            url: `/accounts?client_id=${bankConsent.clientId}`,
            method: "GET",
            headers: {
                "X-Consent-Id": bankConsent.consentId,
            }
        }, cacheKey);

        return bankAccounts.data.account.filter(account => {
            return !onlyEnabled || account.status === "Enabled";
        });
    }

    public async getAccountInfo(userId: number, bankId: string, accountId: string) {
        const bankConsent = await this.consentsService.getUserBankConsent(bankId, userId);

        const cacheKey = `${this.cacheKey}:${bankConsent.consentId}:${accountId}:${userId}`;
        const account = await this.banksService.requestBankAPI<{
            data: { account: AccountType }
        }>(bankConsent.bankId, {
            url: `/accounts/${accountId}`,
            method: "GET",
            headers: {
                "X-Consent-Id": bankConsent.consentId,
            }
        }, cacheKey);

        return account.data.account[0];
    }

    public async createAccount(userId: number, bankId: string, account: AccountDTO) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const response = await this.banksService.requestBankAPI<{ data: CreatedAccountType }>(bankId, {
            url: `/accounts?client_id=${consent.clientId}`,
            method: "POST",
            headers: {
                "X-Consent-Id": consent.consentId,
            },
            data: {
                account_type: account.type,
                initial_balance: 0
            }
        });

        const cacheKey = `${this.cacheKey}:${consent.consentId}`;
        await this.redisService.invalidateCache(cacheKey, userId);

        return response.data;
    }

    public async closeAccount(userId: number, bankId: string, accountId: string, accountCloseDTO: AccountCloseDTO) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const accounts = await this.getBankAccounts(userId, bankId);

        let firstAccountId: string | null = null;
        for (const account of accounts) {
            if (account.accountId != accountId && account.status === "Enabled" && account.accountSubType === "Checking") {
                firstAccountId = account.accountId;
            }
        }

        if (!firstAccountId) {
            throw new BadRequestException("У вас нет подходящего счета для перевода средств");
        }

        const response = await this.banksService.requestBankAPI<{ data: AccountType }>(bankId, {
            url: `/accounts/${accountId}/close?client_id=${consent.clientId}`,
            method: "PUT",
            headers: {
                "X-Consent-Id": consent.consentId,
            },
            data: {
                action: accountCloseDTO.action,
                destination_account_id: firstAccountId
            }
        });

        await this.redisService.invalidateCache(this.cacheKey, userId);
        await this.redisService.invalidateCache(this.cacheKey, consent.consentId, userId);
        await this.redisService.invalidateCache(this.cacheKey, consent.consentId, accountId, userId);

        return response.data;
    }

    public async getBalance(accountId: string, bankId: string, userId: number) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const cacheKey = `${this.cacheKey}:${accountId}:${consent.consentId}:${userId}:balance`;
        const response = await this.banksService.requestBankAPI<{ data: { balance: any[] } }>(bankId, {
            url: `/accounts/${accountId}/balances`,
            method: "GET",
            headers: {
                "X-Consent-Id": consent.consentId,
            }
        }, cacheKey);

        for (const balance of response.data.balance) {
            if (balance.type === "InterimAvailable") {
                return Math.round(parseFloat(balance.amount.amount) * 100) / 100;
            }
        }

        return 0;
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    private async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId, accountId] = event.entityIds;

        await this.redisService.invalidateCache(this.cacheKey, accountId, "*", userId, "balance");
        await this.redisService.invalidateCache(this.cacheExtendedKey, userId);
    }

    @OnEvent('cache.invalidate.consents', {async: true})
    private async handleConsentsCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache(this.cacheKey, userId);
    }

    @OnEvent('cache.invalidate.accounts', {async: true})
    @OnEvent('cache.invalidate.consents', {async: true})
    private async handleExtendedCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache(this.cacheExtendedKey, userId);
    }
}
