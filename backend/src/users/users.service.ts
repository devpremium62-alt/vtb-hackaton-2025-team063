import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {UserDTO, UserLoginDTO} from "./user.dto";
import {Base64Service} from "../common/base64.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private base64Service: Base64Service,
    ) {}

    public async createUser(userDTO: UserDTO): Promise<User> {
        const user = await this.usersRepository.findOne({where: {phone: userDTO.phone}});
        if(user) {
            throw new HttpException('Пользователь с таким номером телефона уже существует', HttpStatus.BAD_REQUEST);
        }

        const userAvatarURL = await this.base64Service.saveBase64Image(userDTO.avatar);

        const newUser = this.usersRepository.create({...userDTO, avatar: userAvatarURL});
        await this.usersRepository.save(newUser);

        return newUser;
    }

    public async getUserByPhone(userLoginDTO: UserLoginDTO): Promise<User> {
        const user = await this.usersRepository.findOne({where: {phone: userLoginDTO.phone}});
        if(!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }

        return user;
    }
}
