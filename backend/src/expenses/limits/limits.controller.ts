import {Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {LimitsService} from "./limits.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";
import {LimitDTO} from "./limit.dto";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Лимиты')
@Controller('limits')
export class LimitsController {
    constructor(private readonly limitsService: LimitsService) {
    }

    @ApiOperation({ summary: 'Создание лимита' })
    @ApiResponse({ status: 200, description: 'Созданный лимит' })
    @ApiCookieAuth('access_token')
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    public async create(@User("id") userId: number, @Body() limitDTO: LimitDTO) {
        return this.limitsService.create(userId, limitDTO);
    }

    @ApiOperation({ summary: 'Получение лимитов семьи' })
    @ApiResponse({ status: 200, description: 'Список лимитов' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.limitsService.getAll(userId);
    }

    @ApiOperation({ summary: 'Удаление лимита' })
    @ApiResponse({ status: 204 })
    @ApiCookieAuth('access_token')
    @Delete("/:limitId")
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@Param("limitId") limitId: number, @User("id") userId: number) {
        const result = await this.limitsService.delete(userId, limitId);
    }
}
