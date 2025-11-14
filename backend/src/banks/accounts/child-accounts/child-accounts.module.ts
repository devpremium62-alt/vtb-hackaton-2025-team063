import {Module} from '@nestjs/common';
import {ChildAccountsService} from './child-accounts.service';
import {ChildAccountsController} from './child-accounts.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChildAccount} from "./child-account.entity";
import {AccountsModule} from "../accounts.module";
import {RedisModule} from "../../../redis/redis.module";
import {FamilyModule} from "../../../family/family.module";
import {TransactionsModule} from "../transactions/transactions.module";
import {FamilyAccountsModule} from "../../../family/family-accounts/family-accounts.module";

@Module({
    imports: [TypeOrmModule.forFeature([ChildAccount]), AccountsModule, RedisModule, FamilyModule, TransactionsModule, FamilyAccountsModule],
    providers: [ChildAccountsService],
    controllers: [ChildAccountsController]
})
export class ChildAccountsModule {
}
