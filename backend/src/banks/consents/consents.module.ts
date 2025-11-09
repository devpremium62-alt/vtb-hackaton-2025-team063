import { Module } from '@nestjs/common';
import { ConsentsController } from './consents.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Consent} from "./consent.entity";
import {BanksModule} from "../banks.module";
import { ConsentsService } from './consents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consent]), BanksModule],
  controllers: [ConsentsController],
  providers: [ConsentsService]
})
export class ConsentsModule {}
