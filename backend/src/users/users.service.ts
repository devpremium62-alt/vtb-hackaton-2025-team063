import {BadRequestException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import {DataSource, EntityManager, Repository} from 'typeorm';
import {UserCreateDTO, UserEditDTO, UserLoginDTO} from "./user.dto";
import {Base64Service} from "../common/base64.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private base64Service: Base64Service,
        private dataSource: DataSource
    ) {}

    public async createUser(user: UserCreateDTO): Promise<User> {
        const foundUser = await this.usersRepository.findOne({where: {phone: user.phone}});
        if(foundUser) {
            throw new BadRequestException("Пользователь с таким номером телефона уже существует");
        }

        const userAvatarURL = await this.base64Service.saveBase64Image(user.avatar);

        return this.dataSource.transaction(async (manager: EntityManager) => {
            const newUser = manager.create(User, {...user, partner: {id: user.partner}, avatar: userAvatarURL});
            await manager.save(newUser);

            if(user.partner) {
                await manager.update(User, {id: user.partner}, {partner: {id: newUser.id}});
            }

            return newUser;
        });
    }

    public async getUserByPhone(userLoginDTO: UserLoginDTO): Promise<User> {
        const user = await this.usersRepository.findOne({where: {phone: userLoginDTO.phone}});
        if(!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    public async editUser(userId: number, userEditDTO: UserEditDTO) {
        if(!userEditDTO) {
            throw new BadRequestException("Укажите значения для изменения");
        }

        await this.usersRepository.update({id: userId}, {...userEditDTO});

        return this.usersRepository.findOne({ where: { id: userId } });
    }
}
