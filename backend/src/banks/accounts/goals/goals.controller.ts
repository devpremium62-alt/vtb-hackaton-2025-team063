import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GoalsService} from "./goals.service";
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";
import {User} from "../../../common/decorators/user.decorator";
import {GoalDTO} from "./goal.dto";
import {DepositDTO} from "../transactions/transaction.dto";

@ApiTags("Финансовые цели")
@Controller('goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {
    }

    @ApiOperation({summary: 'Получение всех целей семьи'})
    @ApiResponse({status: 200, description: 'Список целей'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.goalsService.getGoals(userId);
    }

    @ApiOperation({summary: 'Создание финансовой цели'})
    @ApiResponse({status: 201, description: 'Созданная цель'})
    @ApiCookieAuth('access_token')
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    public async create(@User("id") userId: number, @Body() goalDTO: GoalDTO) {
        return this.goalsService.createGoal(userId, goalDTO);
    }

    @ApiOperation({summary: 'Перевод на счет финансовой цели'})
    @ApiResponse({status: 200, description: 'Финансовая цель'})
    @ApiCookieAuth('access_token')
    @Put("/:goalId")
    @UseGuards(JwtAuthGuard)
    public async deposit(@User("id") userId: number, @Param("goalId") goalId: string, @Body() depositDTO: DepositDTO) {
        return this.goalsService.depositGoal(userId, goalId, depositDTO);
    }

    @ApiOperation({summary: 'Удаление финансовой цели'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete("/:goalId")
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    public async delete(@User("id") userId: number, @Param("goalId") goalId: string) {
        await this.goalsService.deleteGoal(userId, goalId);
    }
}
