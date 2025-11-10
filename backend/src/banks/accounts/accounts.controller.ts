import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {AccountsService} from "./accounts.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Счета")
@Controller('accounts')
export class AccountsController {
    public constructor(private readonly accountsService: AccountsService) {
    }

    @ApiOperation({ summary: 'Получение счетов пользователя во всех банках' })
    @ApiResponse({ status: 200, description: 'Список счетов' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAccounts(@User("id") userId: number) {
        return this.accountsService.getAccounts(userId);
    }

    @ApiOperation({ summary: 'Получение баланса счета' })
    @ApiResponse({ status: 200, description: 'Баланс счета' })
    @ApiCookieAuth('access_token')
    @Get("/:bankId/:accountId/balance")
    @UseGuards(JwtAuthGuard)
    public async getBalance(@Param() params: object, @User("id") userId: number) {
        return this.accountsService.getBalance(params["accountId"], params["bankId"], userId);
    }

    @ApiOperation({ summary: 'Получения суммы балансов всех счетов пользователя' })
    @ApiResponse({ status: 200, description: 'Баланс всех счетов' })
    @ApiCookieAuth('access_token')
    @Get("/balance")
    @UseGuards(JwtAuthGuard)
    public async getTotalBalance(@User("id") userId: number) {
        const totalBalance = await this.accountsService.getTotalBalance(userId);
        return {totalBalance};
    }
}
