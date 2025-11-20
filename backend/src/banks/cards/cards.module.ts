import {Module} from '@nestjs/common';
import {CardsService} from './cards.service';
import {BanksModule} from "../banks.module";
import {RedisModule} from "../../redis/redis.module";
import {ConsentsModule} from "../consents/consents.module";
import { CardsController } from './cards.controller';

@Module({
    imports: [BanksModule, RedisModule, ConsentsModule],
    providers: [CardsService],
    controllers: [CardsController],
    exports: [CardsService]
})
export class CardsModule {
}
