import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import {HttpModule} from "@nestjs/axios";
import {RedisModule} from "../redis/redis.module";
import { BanksQueueService } from './banks-queue.service';

@Module({
  imports: [HttpModule, RedisModule],
  providers: [BanksService, BanksQueueService],
  exports: [BanksService],
})
export class BanksModule {}
