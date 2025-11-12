import {Injectable} from '@nestjs/common';
import {BanksService} from "../../../banks.service";
import {PaymentConsentDTO} from "./payment-consent.dto";
import {ConsentsService} from "../../../consents/consents.service";
import {ConfigService} from "@nestjs/config";
import {PaymentConsentType} from "../../../banks.types";

@Injectable()
export class PaymentConsentsService {
    public constructor(
        private readonly banksService: BanksService,
        private readonly consentService: ConsentsService,
        private readonly configService: ConfigService) {
    }

    public async createPaymentConsent(userId: number, paymentConsent: PaymentConsentDTO) {
        const bankConsent = await this.consentService.getUserBankConsent(paymentConsent.fromBankId, userId);

        const bankId = this.configService.get<string>("CLIENT_ID");

        const result = await this.banksService.requestBankAPI<PaymentConsentType>(paymentConsent.fromBankId, {
            url: `/payment-consents/request`,
            method: "POST",
            data: {
                requesting_bank: bankId,
                client_id: bankConsent.clientId,
                consent_type: "single_use",
                amount: paymentConsent.amount,
                debtor_account: paymentConsent.fromAccount,
                creditor_account: paymentConsent.toAccount,
                creditor_name: paymentConsent.toName,
                reference: paymentConsent.reference
            }
        });

        return result;
    }
}
