import {Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";
import {User} from "../../../common/decorators/user.decorator";
import {TransactionsService} from "./transactions.service";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TransactionDTO, UpdateTransactionDTO} from "./transaction.dto";

@ApiTags('Транзакции')
@Controller('transactions')
export class TransactionsController {
    public constructor(private readonly transactionService: TransactionsService) {
    }

    @ApiOperation({summary: 'Получение транзакций пользователя за текущий месяц'})
    @ApiResponse({status: 200, description: 'Список транзакций из всех банков'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public getAll(@User("id") userId: number) {
        return this.transactionService.getTransactions(userId);
    }

    @ApiOperation({summary: 'Создание транзакции'})
    @ApiResponse({status: 201, description: 'Созданная транзакция'})
    @ApiCookieAuth('access_token')
    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    public create(@User("id") userId: number, @Body() transactionDTO: TransactionDTO) {
        return this.transactionService.createTransaction(userId, transactionDTO);
    }

    @ApiOperation({summary: 'Изменение категории транзакции'})
    @ApiResponse({status: 200, description: 'Обновленная транзакция'})
    @ApiCookieAuth('access_token')
    @Patch("/:transactionId")
    @UseGuards(JwtAuthGuard)
    public update(@User("id") userId: number, @Param("transactionId") transactionId: string, @Body() transactionDTO: UpdateTransactionDTO) {
        return this.transactionService.updateTransaction(userId, transactionId, transactionDTO);
    }
}
