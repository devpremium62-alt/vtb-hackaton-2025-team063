import { Module } from '@nestjs/common';
import { ConsentsController } from './consents.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Consent} from "./consent.entity";
import {BanksModule} from "../banks.module";
import { ConsentsService } from './consents.service';
import {RedisModule} from "../../redis/redis.module";
import {CryptoModule} from "../../crypto/crypto.module";
import {ConsentTransformerProvider} from "./consent-transformer.provider";

@Module({
  imports: [TypeOrmModule.forFeature([Consent]), CryptoModule, BanksModule, RedisModule],
  controllers: [ConsentsController],
  providers: [ConsentsService, ConsentTransformerProvider],
  exports: [ConsentsService]
})
export class ConsentsModule {}
