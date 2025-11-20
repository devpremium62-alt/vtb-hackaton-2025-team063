import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";
import {User} from "../../../common/decorators/user.decorator";
import {CashbackService} from "./cashback.service";

@ApiTags("Кэшбэк")
@Controller('cashback')
export class CashbackController {
    public constructor(private readonly cashbackService: CashbackService) {
    }

    @ApiOperation({summary: 'Получение кэшбэка пользователя'})
    @ApiResponse({status: 200, description: 'Кэшбэк'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getCashback(@User("id") userId: number) {
        return this.cashbackService.getCardsCashback(userId);
    }
}
