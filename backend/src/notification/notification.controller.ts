import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get('receiver')
    async getNotifications(@Req() req: Request, @Query('page') page: number = 1) {
        return this.notificationService.getNotifications(req['user'].id, page);
    }

    @Get('count-unread')
    async getUnreadCount(@Req() req: Request) {
        return await this.notificationService.countUnreadNotifications(req['user'].id);
    }

    @Get('mark-all-read')
    async markAllAsRead(@Req() req: Request) {
        return this.notificationService.markAllAsRead(req['user'].id);
    }

    @Get('mark-as-read')
    async markAsRead(@Req() req: Request, @Query('notificationId') notificationId: string) {
        return this.notificationService.markAsRead(notificationId);
    }
}
