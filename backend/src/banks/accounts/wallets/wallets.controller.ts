import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {WalletsService} from "./wallets.service";
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";
import {User} from "../../../common/decorators/user.decorator";
import {DepositDTO} from "../transactions/transaction.dto";
import {WalletDTO} from "./wallet.dto";

@ApiTags("Кошельки")
@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) {}

    @ApiOperation({summary: 'Получение всех кошельков семьи'})
    @ApiResponse({status: 200, description: 'Список кошельков'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.walletsService.getAll(userId);
    }

    @ApiOperation({summary: 'Создание кошелька'})
    @ApiResponse({status: 201, description: 'Созданный кошелек'})
    @ApiCookieAuth('access_token')
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    public async create(@User("id") userId: number, @Body() walletDTO: WalletDTO) {
        return this.walletsService.createWallet(userId, walletDTO);
    }

    @ApiOperation({summary: 'Перевод на счет кошелька'})
    @ApiResponse({status: 200, description: 'Кошелек'})
    @ApiCookieAuth('access_token')
    @Put("/:walletId")
    @UseGuards(JwtAuthGuard)
    public async deposit(@User("id") userId: number, @Param("walletId") walletId: string, @Body() depositDTO: DepositDTO) {
        return this.walletsService.depositWallet(userId, walletId, depositDTO);
    }

    @ApiOperation({summary: 'Удаление кошелька'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete("/:walletId")
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    public async delete(@User("id") userId: number, @Param("walletId") walletId: string) {
        await this.walletsService.deleteWallet(userId, walletId);
    }
}
