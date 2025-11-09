import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user.entity";
import { UsersService } from './users.service';
import {CommonModule} from "../common/common.module";
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CommonModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
