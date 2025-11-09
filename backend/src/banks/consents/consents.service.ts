import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {BanksService} from "../banks.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Consent} from "./consent.entity";
import {CreateConsentDto} from "./consent.dto";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ConsentsService {
    public constructor(
        @InjectRepository(Consent)
        private readonly consentsRepository: Repository<Consent>,
        private readonly configService: ConfigService,
        private readonly bankService: BanksService) {

    }

    public async createConsent(bankId: string, userId: number, consentDTO: CreateConsentDto) {
        const requestingBank = this.configService.get<string>("CLIENT_ID");

        const consentData = await this.bankService.requestBankAPI<{ consent_id: string }>(bankId, {
            url: "/account-consents/request",
            method: "POST",
            data: {
                "client_id": consentDTO.client_id,
                "permissions": ["ReadAccountsDetail", "ReadBalances"],
                "reason": "Агрегация счетов для HackAPI",
                "requesting_bank": requestingBank,
                "requesting_bank_name": "Семейный Мультибанк"
            }
        });

        await this.consentsRepository.delete({bankId, user: {id: userId}});

        const consent = this.consentsRepository.create({
            bankId,
            user: {id: userId},
            id: consentData.consent_id,
            clientId: consentDTO.client_id
        });
        await this.consentsRepository.save(consent);

        return consent;
    }

    public async deleteConsent(bankId: string, consentId: string, userId: number) {
        const consent = await this.consentsRepository.findOne({where: {bankId, user: {id: userId}, id: consentId}});
        if (!consent) {
            throw new NotFoundException("Согласие не найдено");
        }

        const response = await this.bankService.requestBankAPI(bankId, {
            url: `/account-consents/${consentId}`,
            method: "DELETE",
        });

        if (!response) {
            await this.consentsRepository.remove(consent);
        }
    }

    public async getUserConsents(userId: number) {
        return this.consentsRepository.find({where: {user: {id: userId}}});
    }

    public async getUserBankConsent(bankId:string, userId: number) {
        const consent = await this.consentsRepository.findOne({where: {bankId, user: {id: userId}}});
        if(!consent) {
            throw new ForbiddenException("У вас нет согласия на эту операцию");
        }

        return consent;
    }
}
