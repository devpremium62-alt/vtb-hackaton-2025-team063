import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import { AuthService } from './auth.service';
import {JwtStrategy} from "./jwt.strategy";
import {CodeModule} from "../family/code/code.module";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        CodeModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'FAMILY_SECRET_KEY',
            signOptions: {expiresIn: '7d'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}