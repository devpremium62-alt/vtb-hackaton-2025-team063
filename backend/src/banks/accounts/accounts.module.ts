import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {BanksModule} from "../banks.module";
import {ConsentsModule} from "../consents/consents.module";
import { AccountsController } from './accounts.controller';

@Module({
  imports: [BanksModule, ConsentsModule],
  providers: [AccountsService],
  controllers: [AccountsController]
})
export class AccountsModule {}
