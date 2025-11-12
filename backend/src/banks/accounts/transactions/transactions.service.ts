import {BadRequestException, Injectable} from '@nestjs/common';
import {BanksService} from "../../banks.service";
import {AccountsService} from "../accounts.service";
import {ConsentsService} from "../../consents/consents.service";
import {CreatedTransactionType, TransactionType} from "../../banks.types";
import {TransformedTransaction, TransactionsTransformer} from "./transaction.transformer";
import {RedisService} from "../../../redis/redis.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Transaction} from "./transaction.entity";
import {In, Repository} from "typeorm";
import {TransactionDTO, UpdateTransactionDTO} from "./transaction.dto";
import {CategoriesConfig} from "./categories/categories.config";
import {PaymentConsentsService} from "./payment-consents/payment-consents.service";
import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";

@Injectable()
export class TransactionsService {
    private baseKey = "transactions";

    public constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly banksService: BanksService,
        private readonly consentsService: ConsentsService,
        private readonly accountsService: AccountsService,
        private readonly transactionsTransformer: TransactionsTransformer,
        private readonly paymentConsentsService: PaymentConsentsService,
        private readonly redisService: RedisService) {
    }

    public async getTransactions(userId: number) {
        return this.redisService.withCache(`${this.baseKey}:${userId}`, 30, async () => {
            const consents = await this.consentsService.getUserConsents(userId);
            const bankToConsents = Object.fromEntries(consents.map(consent => [consent.bankId, consent.id]));

            const bankAccounts = await this.accountsService.getAccounts(userId);

            const promises: Promise<any>[] = [];
            const transactions: TransformedTransaction[] = [];

            for (const [bank, accounts] of Object.entries(bankAccounts) as [string, any][]) {
                for (const account of accounts) {
                    const accountKey = `${this.baseKey}:${userId}:${account.id}`;

                    promises.push(this.banksService.requestBankAPI<{ data: { transaction: TransactionType[] } }>(bank, {
                            url: `/accounts/${account.accountId}/transactions?limit=100`,
                            method: "GET",
                            headers: {
                                "X-Consent-Id": bankToConsents[bank],
                            }
                        }, accountKey)
                        .then(async accountTransactions => {
                            const transformed = accountTransactions.data.transaction.map(t => this.transactionsTransformer.transform(t, bank));
                            transactions.push(...transformed);
                        })
                        .catch(err => console.error(err))
                    )
                }
            }

            await Promise.all(promises);

            const idToTransactions = Object.fromEntries(transactions.map(t => [t.id, t]));
            const userTransactions = await this.transactionRepository.find({where: {id: In(Object.keys(idToTransactions))}});
            for (const transaction of userTransactions) {
                idToTransactions[transaction.id].category = {
                    id: transaction.categoryId,
                    name: CategoriesConfig[transaction.categoryId].name
                };
            }

            return Object.values(idToTransactions).sort((a, b) => b.date.getTime() - a.date.getTime());
        });
    }

    public async createTransaction(userId: number, data: Partial<TransactionDTO>) {
        const transactionDTO = plainToInstance(TransactionDTO, data);
        await validateOrReject(transactionDTO);

        const balance = await this.accountsService.getBalance(transactionDTO.fromAccountId, transactionDTO.fromBank, userId);
        if (balance < transactionDTO.amount) {
            throw new BadRequestException("Недостаточно средств для выполнения операции");
        }

        const bankConsent = await this.consentsService.getUserBankConsent(transactionDTO.fromBank, userId);

        const consent = await this.paymentConsentsService.createPaymentConsent(userId, {
            amount: transactionDTO.amount,
            fromAccount: transactionDTO.fromAccount,
            fromBankId: transactionDTO.fromBank,
            reference: transactionDTO.comment
        });

        const transaction = await this.banksService.requestBankAPI<{
            data: CreatedTransactionType
        }>(bankConsent.bankId, {
            url: `/payments?client_id=${bankConsent.clientId}`,
            method: "POST",
            headers: {
                "X-Consent-Id": bankConsent.id,
                "X-Payment-Consent-Id": consent.consent_id
            },
            data: {
                data: {
                    initiation: {
                        instructedAmount: {
                            amount: transactionDTO.amount,
                            currency: "RUB"
                        },
                        debtorAccount: {
                            schemeName: "RU.CBR.PAN",
                            identification: transactionDTO.fromAccount
                        },
                        creditorAccount: {
                            schemeName: "RU.CBR.PAN",
                            identification: transactionDTO.toAccount,
                            bank_code: transactionDTO.toBank
                        },
                        comment: transactionDTO.comment
                    }
                }
            }
        });

        await this.redisService.invalidateCache(this.baseKey, userId);
        await this.redisService.invalidateCache(this.baseKey, userId, transactionDTO.fromAccountId);
        await this.redisService.invalidateCache(this.baseKey, "*", transactionDTO.toAccountId);

        return transaction.data;
    }

    public async updateTransaction(userId: number, transactionId: string, updateTransactionDTO: UpdateTransactionDTO) {
        let transaction = await this.transactionRepository.findOne({
            where: {user: {id: userId}, id: transactionId},
        });

        if (transaction) {
            Object.assign(transaction, updateTransactionDTO);
        } else {
            transaction = this.transactionRepository.create({
                ...updateTransactionDTO,
                user: {id: userId},
                id: transactionId,
            });
        }

        const saved = await this.transactionRepository.save(transaction);

        await this.redisService.invalidateCache(this.baseKey, userId);

        return saved;
    }
}
