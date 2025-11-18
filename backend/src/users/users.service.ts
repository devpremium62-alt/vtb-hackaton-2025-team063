import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {DataSource, EntityManager, Repository} from 'typeorm';
import {UserCreateDTO, UserEditDTO, UserLoginDTO} from "./user.dto";
import {AccountsService} from "../banks/accounts/accounts.service";
import {TransactionsService} from "../banks/accounts/transactions/transactions.service";
import {RedisService} from "../redis/redis.service";
import {OnEvent} from "@nestjs/event-emitter";
import {CacheInvalidateEvent} from "../common/events/cache-invalidate.event";
import {NotificationsService} from "../notifications/notifications.service";

@Injectable()
export class UsersService {
    private baseKey = "users";

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly dataSource: DataSource,
        private readonly accountsService: AccountsService,
        private readonly transactionsService: TransactionsService,
        private readonly redisService: RedisService,
        private readonly notificationsService: NotificationsService,
    ) {
    }

    public async createUser(user: UserCreateDTO): Promise<User> {
        const foundUser = await this.usersRepository.findOne({where: {phone: user.phone}});
        if (foundUser) {
            throw new BadRequestException("Пользователь с таким номером телефона уже существует");
        }

        return this.dataSource.transaction(async (manager: EntityManager) => {
            const newUser = manager.create(User, {...user, partner: user.partner ? {id: user.partner} : undefined});
            await manager.save(newUser);

            if (user.partner) {
                await manager.update(User, {id: user.partner}, {partner: {id: newUser.id}});
                await this.redisService.invalidateCache(this.baseKey, user.partner);
                await this.notificationsService.sendNotification("Подключение к семье", `${user.name} подключился(-acь) к семье!`, user.partner);
            }

            return newUser;
        });
    }

    public async findUser(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({where: {id: userId}});
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    public async getUserByPhone(userLoginDTO: UserLoginDTO): Promise<User> {
        const user = await this.usersRepository.findOne({where: {phone: userLoginDTO.phone}});
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    public async editUser(userId: number, userEditDTO: UserEditDTO) {
        if (!userEditDTO) {
            throw new BadRequestException("Укажите значения для изменения");
        }

        await this.usersRepository.update({id: userId}, {...userEditDTO});

        return this.usersRepository.findOne({where: {id: userId}});
    }

    public async getUserExtendedInfo(userId: number) {
        return this.redisService.withCache(`finance:${userId}`, 300, async () => {
            const getAccountDigits = this.accountsService.getAccounts(userId)
                .then(accounts => Object.values(accounts).flat(1)[0])
                .then((account) => account ? account.account.at(-1)!.identification.slice(-4) : null);

            const getBalance = this.accountsService.getTotalBalance(userId)
                .then(balance => Math.round(balance));

            const getIncome = this.transactionsService.getTransactions(userId)
                .then((transactions) => {
                    let monthlyIncome = 0;
                    for (const transaction of transactions) {
                        if (!transaction.outcome && transaction.status === "completed") {
                            monthlyIncome += transaction.value;
                        }
                    }

                    return Math.round(monthlyIncome * 100) / 100;
                });

            const [account, balance, monthlyIncome] = await Promise.all([getAccountDigits, getBalance, getIncome]);

            return {account, balance, monthlyIncome};
        });
    }

    @OnEvent('cache.invalidate.transactions', {async: true})
    @OnEvent('cache.invalidate.consents', {async: true})
    async handleConsentsInvalidation(event: CacheInvalidateEvent) {
        const [userId] = event.entityIds;

        await this.redisService.invalidateCache("finance", userId);
    }
}
