import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersModule} from './users/users.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {CommonModule} from './common/common.module';
import {ConfigModule} from '@nestjs/config';
import {User} from "./users/user.entity";
import {Consent} from "./banks/consents/consent.entity";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {ConsentsModule} from './banks/consents/consents.module';
import {BanksModule} from './banks/banks.module';
import {AccountsModule} from "./banks/accounts/accounts.module";
import {FamilyModule} from './family/family.module';
import {RedisModule} from './redis/redis.module';
import {CategoriesModule} from './banks/accounts/transactions/categories/categories.module';
import {LimitsModule} from './limits/limits.module';
import {Limit} from "./limits/limit.entity";
import {TransactionsModule} from "./banks/accounts/transactions/transactions.module";
import { PaymentsModule } from './payments/payments.module';
import {Payment} from "./payments/payment.entity";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {Goal} from "./banks/accounts/goals/goal.entity";
import {GoalsModule} from "./banks/accounts/goals/goals.module";
import {Transaction} from "./banks/accounts/transactions/transaction.entity";
import {ExpensesModule} from "./family/expenses/expenses.module";
import {ChildAccount} from "./banks/accounts/child-accounts/child-account.entity";
import {ChildAccountsModule} from "./banks/accounts/child-accounts/child-accounts.module";
import {PaymentConsentsModule} from "./banks/accounts/transactions/payment-consents/payment-consents.module";
import {WalletsModule} from "./banks/accounts/wallets/wallets.module";
import {Wallet} from "./banks/accounts/wallets/wallet.entity";
import {ScheduleModule} from "@nestjs/schedule";
import { CryptoModule } from './crypto/crypto.module';
import {FamilyAccountsModule} from "./family/family-accounts/family-accounts.module";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'family_multibank',
            entities: [User, Consent, Limit, Payment, Goal, Transaction, ChildAccount, Wallet],
            synchronize: true,
        }),
        EventEmitterModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        RedisModule,
        UsersModule,
        CommonModule,
        AuthModule,
        PaymentConsentsModule,
        TransactionsModule,
        GoalsModule,
        ChildAccountsModule,
        AccountsModule,
        FamilyAccountsModule,
        ConsentsModule,
        BanksModule,
        ExpensesModule,
        FamilyModule,
        CategoriesModule,
        LimitsModule,
        PaymentsModule,
        WalletsModule,
        CryptoModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}