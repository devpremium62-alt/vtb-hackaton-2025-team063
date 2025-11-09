import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
