import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";
import {CardsService} from "./cards.service";

@ApiTags("Карты")
@Controller('cards')
export class CardsController {
    public constructor(private readonly cardsService: CardsService) {}

    @ApiOperation({summary: 'Получение cписка карт пользователя'})
    @ApiResponse({status: 200, description: 'Список карт'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getCards(@User("id") userId: number) {
        return this.cardsService.getCards(userId);
    }
}
