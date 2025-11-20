import {Module} from '@nestjs/common';
import {FamilyService} from './family.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {CodeModule} from './code/code.module';
import {FamilyController} from './family.controller';
import {UsersModule} from "../users/users.module";
import {RedisModule} from "../redis/redis.module";
import {FamilyCacheService} from "./family-cache.service";
import {CashbackModule} from "../banks/cards/cashback/cashback.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), UsersModule, CodeModule, RedisModule, CashbackModule],
    providers: [FamilyService, FamilyCacheService],
    exports: [FamilyService, FamilyCacheService],
    controllers: [FamilyController],
})
export class FamilyModule {
}
