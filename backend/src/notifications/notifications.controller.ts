import {Body, Controller, Delete, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {NotificationsService} from "./notifications.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";
import {NotificationDTO} from "./notification.dto";

@ApiTags("Уведомления")
@Controller('notifications')
export class NotificationsController {
    public constructor(private readonly notificationsService: NotificationsService) {}

    @ApiOperation({summary: 'Включение уведомлений'})
    @ApiResponse({status: 201})
    @ApiCookieAuth('access_token')
    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    public async create(@User("id") userId: number, @Body() notificationDTO: NotificationDTO) {
        return this.notificationsService.subscribeNotifications(userId, notificationDTO);
    }

    @ApiOperation({summary: 'Отключение уведомлений'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete()
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@User("id") userId: number) {
        await this.notificationsService.unsubscribeNotifications(userId);
    }

    @ApiOperation({summary: 'Получение статуса включенности уведомлений'})
    @ApiResponse({status: 200, description: "Информация о уведомлениях для пользователя"})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async get(@User("id") userId: number) {
        return this.notificationsService.getUserNotification(userId);
    }
}
