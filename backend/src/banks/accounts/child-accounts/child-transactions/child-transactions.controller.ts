import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../../../auth/jwt-auth.guard";
import {User} from "../../../../common/decorators/user.decorator";
import {ChildTransactionsService} from "./child-transactions.service";
import {CategoriesService} from "../../transactions/categories/categories.service";

@ApiTags("Транзакции детских счетов")
@Controller('child-accounts/transactions')
export class ChildTransactionsController {
    public constructor(
        private readonly childTransactionsService: ChildTransactionsService,
        private readonly categoriesService: CategoriesService,
    ) {
    }

    @ApiOperation({summary: 'Получение транзакций детских счетов за месяц'})
    @ApiResponse({status: 200, description: 'Список транзакций'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.childTransactionsService.getTransactions(userId);
    }

    @ApiOperation({summary: 'Получение расходов детских счетов по категориям'})
    @ApiResponse({status: 200, description: 'Список категорий расходов'})
    @ApiCookieAuth('access_token')
    @Get("/categories")
    @UseGuards(JwtAuthGuard)
    public async getCategories(@User("id") userId: number) {
        return this.categoriesService.groupTransactionsByCategories(await this.childTransactionsService.getTransactions(userId));
    }
}
