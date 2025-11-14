import {Module} from '@nestjs/common';
import {WalletsService} from './wallets.service';
import {WalletsController} from './wallets.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Wallet} from "./wallet.entity";
import {TransactionsModule} from "../transactions/transactions.module";
import {FamilyModule} from "../../../family/family.module";
import {RedisModule} from "../../../redis/redis.module";
import {AccountsModule} from "../accounts.module";
import {FamilyAccountsModule} from "../../../family/family-accounts/family-accounts.module";

@Module({
    imports: [TypeOrmModule.forFeature([Wallet]), AccountsModule, TransactionsModule, FamilyModule, FamilyAccountsModule, RedisModule],
    providers: [WalletsService],
    controllers: [WalletsController]
})
export class WalletsModule {
}
