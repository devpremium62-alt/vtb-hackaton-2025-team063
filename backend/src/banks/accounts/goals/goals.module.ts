import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Goal} from "./goal.entity";
import {AccountsModule} from "../accounts.module";
import {RedisModule} from "../../../redis/redis.module";
import {GoalsService} from './goals.service';
import {FamilyModule} from "../../../family/family.module";
import {GoalsController} from './goals.controller';
import {TransactionsModule} from "../transactions/transactions.module";
import {FamilyAccountsModule} from "../../../family/family-accounts/family-accounts.module";

@Module({
    imports: [TypeOrmModule.forFeature([Goal]), AccountsModule, FamilyModule, TransactionsModule, FamilyAccountsModule, RedisModule],
    providers: [GoalsService],
    controllers: [GoalsController]
})
export class GoalsModule {
}
