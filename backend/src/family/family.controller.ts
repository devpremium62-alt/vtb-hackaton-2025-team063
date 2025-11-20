import {Controller, Delete, Get, HttpCode, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FamilyService} from "./family.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";
import {User as UserEntity} from "../users/user.entity";
import {UsersService} from "../users/users.service";
import {CashbackService} from "../banks/cards/cashback/cashback.service";

@ApiTags("Семья")
@Controller('family')
export class FamilyController {
    constructor(
        private readonly familyService: FamilyService,
        private readonly userService: UsersService,
        private readonly cashbackService: CashbackService,
    ) {}

    @ApiOperation({ summary: 'Получение данных пользователей семьи' })
    @ApiResponse({ status: 200, description: 'Список пользователей' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async get(@User() user: UserEntity) {
        const member = await this.familyService.getFamilyMember(user.id);
        if(member) {
            return [user, member];
        }

        return [user];
    }

    @ApiOperation({ summary: 'Выход из семьи' })
    @ApiResponse({ status: 204 })
    @ApiCookieAuth('access_token')
    @Delete()
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@User("id") userId: number) {
        await this.familyService.leaveFamily(userId);
    }

    @ApiOperation({ summary: 'Получение расширенных данных пользователей семьи' })
    @ApiResponse({ status: 200, description: 'Список пользователей' })
    @ApiCookieAuth('access_token')
    @Get("/finance")
    @UseGuards(JwtAuthGuard)
    public async getExtendedInfo(@User() user: UserEntity) {
        const myInfo = await this.userService.getUserExtendedInfo(user.id);
        const response = [{...user, ...myInfo}];

        const member = await this.familyService.getFamilyMember(user.id);
        if(member) {
            const memberInfo = await this.userService.getUserExtendedInfo(member?.id);
            response.push({...member, ...memberInfo});
        }

        return response;
    }

    @ApiOperation({ summary: 'Получение кэшбэка семьи' })
    @ApiResponse({ status: 200, description: 'Кэшбэк' })
    @ApiCookieAuth('access_token')
    @Get("/cashback")
    @UseGuards(JwtAuthGuard)
    public async getCashback(@User("id") userId: number) {
        const myCashback = await this.cashbackService.getCardsCashback(userId);

        const memberId = await this.familyService.getFamilyMemberId(userId);
        if(memberId) {
            const memberCashback = await this.cashbackService.getCardsCashback(memberId);
            myCashback.push(...memberCashback);
        }

        return myCashback;
    }
}
