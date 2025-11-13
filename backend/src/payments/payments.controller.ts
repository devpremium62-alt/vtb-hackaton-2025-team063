import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";
import {PaymentsService} from "./payments.service";
import {PaymentDTO} from "./payment.dto";
import {DepositDTO} from "../banks/accounts/transactions/transaction.dto";

@ApiTags("Платежи")
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {
    }

    @ApiOperation({summary: 'Получение всех платежей семьи'})
    @ApiResponse({status: 200, description: 'Список платежей'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.paymentsService.getAll(userId);
    }

    @ApiOperation({summary: 'Создание платежа'})
    @ApiResponse({status: 201, description: 'Созданный платеж'})
    @ApiCookieAuth('access_token')
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    public async create(@User("id") userId: number, @Body() paymentDTO: PaymentDTO) {
        return this.paymentsService.create(userId, paymentDTO);
    }

    @ApiOperation({summary: 'Внесение платежа'})
    @ApiResponse({status: 200, description: 'Платеж'})
    @ApiCookieAuth('access_token')
    @Put("/:paymentId")
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    public async deposit(@User("id") userId: number, @Param("paymentId") paymentId: number, @Body() depositDTO: DepositDTO) {
        return this.paymentsService.deposit(userId, paymentId, depositDTO);
    }

    @ApiOperation({summary: 'Удаление платежа'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete("/:paymentId")
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    public async delete(@User("id") userId: number, @Param("paymentId") paymentId: number) {
        await this.paymentsService.delete(userId, paymentId);
    }
}
