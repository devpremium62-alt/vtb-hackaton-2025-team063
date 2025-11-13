import {Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {AccountsService} from "./accounts.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ValidateBankIdPipe} from "../../common/pipes/validate-bank-id.pipe";
import {AccountCloseDTO, AccountDTO} from "./account.dto";
import {use} from "passport";

@ApiTags("Счета")
@Controller('accounts')
export class AccountsController {
    public constructor(private readonly accountsService: AccountsService) {
    }

    @ApiOperation({summary: 'Получение счетов пользователя во всех банках'})
    @ApiResponse({status: 200, description: 'Список счетов'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAccounts(@User("id") userId: number) {
        return this.accountsService.getAccounts(userId);
    }

    @ApiOperation({summary: 'Получение счетов пользователя во всех банках с балансами'})
    @ApiResponse({status: 200, description: 'Список счетов'})
    @ApiCookieAuth('access_token')
    @Get("/extended")
    @UseGuards(JwtAuthGuard)
    public async getExtendedAccounts(@User("id") userId: number) {
        return this.accountsService.getAccountsForPayments(userId);
    }

    @ApiOperation({summary: 'Получение данных счета'})
    @ApiResponse({status: 200, description: 'Данные счета'})
    @ApiCookieAuth('access_token')
    @Get("/:bankId/:accountId")
    @UseGuards(JwtAuthGuard)
    public async getAccount(@User("id") userId: number, @Param("bankId", ValidateBankIdPipe) bankId: string, @Param("accountId") accountId: string) {
        return this.accountsService.getAccountInfo(userId, bankId, accountId);
    }

    @ApiOperation({summary: 'Создание нового счета'})
    @ApiResponse({status: 201, description: 'Созданный счет'})
    @ApiCookieAuth('access_token')
    @Post("/:bankId")
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    public async create(@Param("bankId", ValidateBankIdPipe) bankId: string, @User("id") userId: number, @Body() accountDTO: AccountDTO) {
        return this.accountsService.createAccount(userId, bankId, accountDTO);
    }

    @ApiOperation({summary: 'Получение баланса счета'})
    @ApiResponse({status: 200, description: 'Баланс счета'})
    @ApiCookieAuth('access_token')
    @Get("/:bankId/:accountId/balance")
    @UseGuards(JwtAuthGuard)
    public async getBalance(
        @Param('bankId', ValidateBankIdPipe) bankId: string,
        @Param('accountId') accountId: string,
        @User('id') userId: number,
    ) {
        return this.accountsService.getBalance(accountId, bankId, userId);
    }

    @ApiOperation({summary: 'Получения суммы балансов всех счетов пользователя'})
    @ApiResponse({status: 200, description: 'Баланс всех счетов'})
    @ApiCookieAuth('access_token')
    @Get("/balance")
    @UseGuards(JwtAuthGuard)
    public async getTotalBalance(@User("id") userId: number) {
        const totalBalance = await this.accountsService.getTotalBalance(userId);
        return {totalBalance};
    }

    @ApiOperation({summary: 'Закрытие счета'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete("/:bankId/:accountId")
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async closeAccount(@User("id") userId: number, @Param("bankId", ValidateBankIdPipe) bankId: string, @Param("accountId") accountId: string, @Body() accountCloseDTO: AccountCloseDTO) {
        await this.accountsService.closeAccount(userId, bankId, accountId, accountCloseDTO);
    }
}
