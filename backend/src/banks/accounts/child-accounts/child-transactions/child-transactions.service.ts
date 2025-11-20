import {Injectable} from '@nestjs/common';
import {TransactionsService} from "../../transactions/transactions.service";
import {FamilyService} from "../../../../family/family.service";
import {TransformedTransaction} from "../../transactions/transaction.transformer";
import {CATEGORIES, CategoriesConfig} from "../../transactions/categories/categories.config";
import crypto from "node:crypto";
import {getRandomDate, getRandomInt} from "../../../../utils";
import {BanksConfig} from "../../../banks.config";
import {InjectRepository} from "@nestjs/typeorm";
import {ChildAccount} from "../child-account.entity";
import {In, Repository} from "typeorm";
import {FamilyCacheService} from "../../../../family/family-cache.service";
import {RedisService} from "../../../../redis/redis.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../../../../common/events/cache-invalidate.event";

const childAccountMockTransactions: Pick<TransformedTransaction, "category" | "name" | "value">[] = [
    {
        category: {id: CATEGORIES.RESTAURANTS, name: CategoriesConfig[CATEGORIES.RESTAURANTS].name},
        name: "Обед в школьной столовой",
        value: 145.00,
    },
    {
        category: {id: CATEGORIES.TRANSPORT, name: CategoriesConfig[CATEGORIES.TRANSPORT].name},
        name: "Проезд на автобусе",
        value: 48.00,
    },
    {
        category: {id: CATEGORIES.OTHER, name: CategoriesConfig[CATEGORIES.OTHER].name},
        name: "Покупка тетрадей",
        value: 120.00,
    },
    {
        category: {id: CATEGORIES.GROCERIES, name: CategoriesConfig[CATEGORIES.GROCERIES].name},
        name: "Пятерочка",
        value: 65.00,
    },
    {
        category: {id: CATEGORIES.ENTERTAINMENT, name: CategoriesConfig[CATEGORIES.ENTERTAINMENT].name},
        name: "Кинотеатр",
        value: 700.00,
    },
    {
        category: {id: CATEGORIES.OTHER, name: CategoriesConfig[CATEGORIES.OTHER].name},
        name: "Секция футбола - ежемесячный взнос",
        value: 1200.00,
    },
    {
        category: {id: CATEGORIES.CLOTHES, name: CategoriesConfig[CATEGORIES.CLOTHES].name},
        name: "Покупка школьной формы",
        value: 3650.00,
    },
    {
        category: {id: CATEGORIES.GIFTS, name: CategoriesConfig[CATEGORIES.GIFTS].name},
        name: "Покупка карточек для коллекции",
        value: 250.00,
    },
    {
        category: {id: CATEGORIES.TRANSPORT, name: CategoriesConfig[CATEGORIES.TRANSPORT].name},
        name: "Пополнение транспортной карты",
        value: 300.00,
    }
];


@Injectable()
export class ChildTransactionsService {
    private baseKey = "child-transactions";

    public constructor(
        @InjectRepository(ChildAccount)
        private readonly childAccountRepository: Repository<ChildAccount>,
        private readonly transactionsService: TransactionsService,
        private readonly familyService: FamilyService,
        private readonly familyCacheService: FamilyCacheService,
        private readonly redisService: RedisService,
    ) {}

    public async getTransactions(userId: number) {
        const partnerId = await this.familyService.getFamilyMemberId(userId);
        const familyKey = this.familyCacheService.getFamilyKey(userId, partnerId);

        return this.redisService.withCache(`${this.baseKey}:${familyKey}`, 3600, async () => {
            const childAccounts = await this.childAccountRepository.find({
                where: {user: {id: In([userId, partnerId])}}
            });
            const childAccountIds = childAccounts.map(c => c.id);

            const [transactions1, transactions2] = await Promise.all(
                [
                    this.transactionsService.getTransactions(userId, ...childAccountIds),
                    partnerId ? this.transactionsService.getTransactions(partnerId, ...childAccountIds) : []
                ]
            );

            return [...transactions1, ...transactions2, ...this.generateTransactions()]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    }

    private generateTransactions(): TransformedTransaction[] {
        const now = new Date();
        const pastMonth = new Date();
        pastMonth.setMonth(pastMonth.getMonth() - 1);

        return Array.from({length: 5}).map(i => ({
            ...childAccountMockTransactions[getRandomInt(0, childAccountMockTransactions.length)],
            id: `tx-${crypto.randomUUID()}`,
            outcome: true,
            date: getRandomDate(pastMonth, now),
            status: "completed",
            bank: BanksConfig[Object.keys(BanksConfig)[getRandomInt(0, Object.keys(BanksConfig).length)]].name,
        }));
    }

    @OnEvent('cache.invalidate.child-accounts', {async: true})
    private async handleCacheInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.familyCacheService.invalidateFamilyCache(this.baseKey, userId as number);
    }
}
