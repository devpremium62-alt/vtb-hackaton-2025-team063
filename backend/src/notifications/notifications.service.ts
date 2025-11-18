import {BadRequestException, Injectable} from '@nestjs/common';
import * as webPush from 'web-push';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Notification} from "./notification.entity";
import {NotificationDTO} from "./notification.dto";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) {
        webPush.setVapidDetails(
            'mailto:service@familymultibank.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!,
        );
    }

    public async subscribeNotifications(userId: number, notificationDTO: NotificationDTO) {
        const found = await this.getUserNotification(userId);
        if (found) {
            throw new BadRequestException("Пользователь уже включил уведомления");
        }

        const notification = this.notificationRepository.create({
            endpoint: notificationDTO.endpoint,
            p256dh: notificationDTO.keys.p256dh,
            auth: notificationDTO.keys.auth,
            user: {id: userId}
        });
        await this.notificationRepository.save(notification);
        return notification;
    }

    public async unsubscribeNotifications(userId: number) {
        const found = await this.getUserNotification(userId);
        if (!found) {
            throw new BadRequestException("Пользователь уже отключил уведомления");
        }

        await this.notificationRepository.remove(found);
    }

    public async getUserNotification(userId: number) {
        return this.notificationRepository.findOne({where: {user: {id: userId}}});
    }

    public async sendNotification(title: string, body: string, ...userIds: (number | undefined)[]) {
        const subs = await this.findNotifications(...userIds);

        for (const sub of subs) {
            await this.send(sub, {
                title,
                body,
                icon: `${process.env.CLIENT_URL}/icons/icon-192x192.png`
            });
        }
    }

    private async findNotifications(...userIds: (number | undefined)[]) {
        return this.notificationRepository.find({where: {user: {id: In(userIds)}}});
    }

    private async send(sub: Notification, payload: any) {
        try {
            await webPush.sendNotification({
                endpoint: sub.endpoint,
                keys: {auth: sub.auth, p256dh: sub.p256dh}
            }, JSON.stringify(payload));
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }
    }
}