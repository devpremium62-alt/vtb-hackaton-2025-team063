import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {BanksService} from "../banks.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Consent} from "./consent.entity";
import {CreateConsentDto} from "./consent.dto";
import {CACHE_POLICY, RedisService} from "../../redis/redis.service";
import {ConsentResponseType} from "../banks.types";
import {Interval} from "@nestjs/schedule";
import { chunk } from 'lodash';

@Injectable()
export class ConsentsService {
    private keyBase = "consents";

    public constructor(
        @InjectRepository(Consent)
        private readonly consentsRepository: Repository<Consent>,
        private readonly redisService: RedisService,
        private readonly bankService: BanksService) {
    }

    public async createConsent(bankId: string, userId: number, consentDTO: CreateConsentDto) {
        const consentData = await this.bankService.requestBankAPI<{
            consent_id?: string,
            request_id?: string,
            status: string;
        }>(bankId, {
            url: "/account-consents/request",
            method: "POST",
            data: {
                "client_id": consentDTO.client_id,
                "permissions": ["ReadAccountsDetail", "ReadBalances", "ReadTransactionsDetail", "ManageAccounts", "ReadCards"],
                "reason": "Агрегация счетов для HackAPI",
                "requesting_bank": process.env.CLIENT_ID,
                "requesting_bank_name": "Семейный Мультибанк"
            }
        });

        await this.consentsRepository.delete({bankId, user: {id: userId}});

        const isPending = consentData.status === "pending";
        const consent = this.consentsRepository.create({
            bankId,
            user: {id: userId},
            consentId: isPending ? consentData.request_id! : consentData.consent_id!,
            clientId: consentDTO.client_id,
            status: isPending ? "pending" : "active",
        });
        await this.consentsRepository.save(consent);
        await this.redisService.invalidateCache(this.keyBase, userId, "*");

        return consent;
    }

    public async deleteConsent(bankId: string, userId: number) {
        const consent = await this.consentsRepository.findOne({where: {bankId, user: {id: userId}}});
        if (!consent) {
            throw new NotFoundException("Согласие не найдено");
        }

        const response = await this.bankService.requestBankAPI(bankId, {
            url: `/account-consents/${consent.consentId}`,
            method: "DELETE",
        });

        if (!response) {
            await this.consentsRepository.remove(consent);
            await this.redisService.invalidateCache(this.keyBase, userId, "*");
        }
    }

    public async getUserConsents(userId: number, all = false) {
        return this.redisService.withCache(`${this.keyBase}:${userId}:${all}`, 3600, async () => {
            const consents = await this.consentsRepository.find({where: {user: {id: userId}}});
            if(all) {
                return consents;
            }

            return consents.filter(c => c.status === "active");
        });
    }

    public async getUserBankConsent(bankId: string, userId: number) {
        return this.redisService.withCache(`${this.keyBase}:${userId}:${bankId}`, 3600, async () => {
            const consent = await this.consentsRepository.findOne({where: {bankId, user: {id: userId}}});
            if (!consent) {
                throw new ForbiddenException("У вас нет согласия на эту операцию");
            }

            return consent;
        });
    }

    @Interval(10000)
    private async checkConsents() {
        return;

        const consents = await this.consentsRepository.find({
            relations: ["user"],
        });

        if (!consents.length) {
            return;
        }

        const batches = chunk(consents, 10);

        for (const batch of batches) {
            await Promise.all(
                batch.map(async (consent) => {
                    try {
                        const consentData = await this.bankService.requestBankAPI<{ data: ConsentResponseType }>(
                            consent.bankId,
                            {
                                url: `/account-consents/${consent.consentId}`,
                                method: "GET",
                            },
                            null,
                            CACHE_POLICY.DONT_CACHE
                        );

                        const status = consentData.data.status;

                        if (status === "Authorized" && consent.status !== "active") {
                            const oldId = consent.id;

                            await this.consentsRepository.delete(oldId);

                            const newConsent = this.consentsRepository.create({
                                ...consent,
                                consentId: consentData.data.consentId,
                                status: "active",
                            });

                            return { action: "update", consent: newConsent };
                        }

                        if (status === "Rejected" || status === "Revoked") {
                            return { action: "remove", consent };
                        }

                        return null;
                    } catch (error) {
                        console.error(error);
                        return null;
                    }
                })
            ).then(async (results) => {
                const toUpdate = results.filter(r => r?.action === "update").map(r => r!.consent);
                const toRemove = results.filter(r => r?.action === "remove").map(r => r!.consent);

                if (toUpdate.length) {
                    await this.consentsRepository.save(toUpdate);
                }

                if (toRemove.length) {
                    await this.consentsRepository.remove(toRemove);
                }

                const userIds = [
                    ...toUpdate.map(c => c.user.id),
                    ...toRemove.map(c => c.user.id)
                ];

                await Promise.all(
                    userIds.map(id => this.redisService.invalidateCache(this.keyBase, id, "*"))
                );
            });
        }
    }
}
