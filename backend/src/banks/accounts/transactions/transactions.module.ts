import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {AccountsModule} from "../accounts.module";
import { TransactionsController } from './transactions.controller';
import {BanksModule} from "../../banks.module";
import {ConsentsModule} from "../../consents/consents.module";
import {TransactionsTransformer} from "./transaction.transformer";
import {RedisModule} from "../../../redis/redis.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Transaction} from "./transaction.entity";
import {PaymentConsentsModule} from "./payment-consents/payment-consents.module";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), BanksModule, ConsentsModule, AccountsModule, RedisModule, PaymentConsentsModule],
  providers: [TransactionsService, TransactionsTransformer],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
