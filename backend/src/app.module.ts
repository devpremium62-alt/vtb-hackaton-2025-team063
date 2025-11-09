import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersModule} from './users/users.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {CommonModule} from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import {User} from "./users/user.entity";
import {Consent} from "./banks/consents/consent.entity";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import { ConsentsModule } from './banks/consents/consents.module';
import { BanksModule } from './banks/banks.module';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'family_multibank',
            entities: [User, Consent],
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        CommonModule,
        AuthModule,
        ConsentsModule,
        BanksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
