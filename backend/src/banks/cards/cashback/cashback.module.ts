import { Module } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import {CardsModule} from "../cards.module";
import {RedisModule} from "../../../redis/redis.module";
import { CashbackController } from './cashback.controller';

@Module({
  imports: [RedisModule, CardsModule],
  providers: [CashbackService],
  controllers: [CashbackController],
  exports: [CashbackService]
})
export class CashbackModule {}
