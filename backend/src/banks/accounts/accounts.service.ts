import {Injectable} from '@nestjs/common';
import {BanksService} from "../banks.service";
import {ConsentsService} from "../consents/consents.service";

@Injectable()
export class AccountsService {
    public constructor(private readonly banksService: BanksService, private readonly consentsService: ConsentsService) {
    }

    public async getTotalBalance(userId: number) {
        let totalBalance = 0;

        const banksToAccounts = await this.getAccounts(userId);
        for (const [bankId, accounts] of Object.entries(banksToAccounts)) {
            for (const account of accounts as any[]) {
                const balances = await this.getBalance(account.accountId, bankId, userId);
                for (const balance of balances) {
                    if (balance.type === "InterimAvailable") {
                        totalBalance += parseFloat(balance.amount.amount);
                    }
                }
            }
        }

        return {totalBalance: Math.round(totalBalance * 100) / 100};
    }

    public async getAccounts(userId: number) {
        const consents = await this.consentsService.getUserConsents(userId);
        const responses = {};

        for (const consent of consents) {
            const response = await this.banksService.requestBankAPI<{ data: { account: any[] } }>(consent.bankId, {
                url: `/accounts?client_id=${consent.clientId}`,
                method: "GET",
                headers: {
                    "X-Consent-Id": consent.id,
                }
            });

            responses[consent.bankId] = response.data.account;
        }

        return responses;
    }

    public async getBalance(accountId: string, bankId: string, userId: number) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const response = await this.banksService.requestBankAPI<{ data: { balance: any[] } }>(bankId, {
            url: `/accounts/${accountId}/balances`,
            method: "GET",
            headers: {
                "X-Consent-Id": consent.id,
            }
        });

        return response.data.balance;
    }
}
