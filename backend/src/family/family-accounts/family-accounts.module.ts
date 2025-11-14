import { Module } from '@nestjs/common';
import { FamilyAccountsService } from './family-accounts.service';
import {FamilyModule} from "../family.module";
import {AccountsModule} from "../../banks/accounts/accounts.module";
import {RedisModule} from "../../redis/redis.module";

@Module({
  imports: [AccountsModule, FamilyModule, RedisModule],
  providers: [FamilyAccountsService],
  exports: [FamilyAccountsService],
})
export class FamilyAccountsModule {}
