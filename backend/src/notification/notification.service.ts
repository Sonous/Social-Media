import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationUser } from 'src/entities/notification-user.entity';
import { Notification } from 'src/entities/notification.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { NotificationGateway } from './notification.gateway';
import { Users } from 'src/entities/user.entity';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';

@Injectable()
export class NotificationService {
    private defaultOffset: number = DEFAULT_OFFSET;
    private defaultLimit: number = DEFAULT_LIMIT;

    constructor(
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
        @InjectRepository(NotificationUser)
        private notificationUserRepo: Repository<NotificationUser>,
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
        private notificationGateway: NotificationGateway,
    ) {}

    async createNofification(
        content: string,
        type: 'follow' | 'like' | 'comment' | 'post',
        sender: Users,
        receiverIds: string[],
        meta: Record<string, any> = {},
    ) {
        const newNotification = this.notificationRepo.create({
            content,
            type,
            sender,
            meta,
        });
        const savedNotification = await this.notificationRepo.save(newNotification);

        // const notificationUsers = [];
        for (const id of receiverIds) {
            const receiver = await this.usersService.getUserById(id);
            const notificationUser = this.notificationUserRepo.create({
                notification: savedNotification,
                receiver,
            });
            const savedNotificationUser = await this.notificationUserRepo.save(notificationUser);
            delete savedNotificationUser.receiver;

            this.notificationGateway.emitNotificationToUser(id, savedNotificationUser);
        }
    }

    async getNotifications(userId: string, page: number) {
        const offset = page * this.defaultOffset - this.defaultOffset;
        const limit = this.defaultLimit;

        const [data, total] = await this.notificationUserRepo
            .createQueryBuilder('notification_user')
            .innerJoinAndSelect('notification_user.notification', 'notification')
            .innerJoinAndSelect('notification.sender', 'sender')
            .where('notification_user.receiver.id = :userId', { userId })
            .orderBy('notification.created_at', 'DESC')
            .offset(offset)
            .limit(limit)
            .getManyAndCount();

        return {
            data,
            limit,
            totalPage: Math.ceil(total / limit),
        };
    }

    async countUnreadNotifications(userId: string) {
        const count = await this.notificationUserRepo
            .createQueryBuilder('notification_user')
            .innerJoin('notification_user.receiver', 'receiver')
            .where('notification_user.receiver.id = :userId', { userId })
            .andWhere('notification_user.isRead = false')
            .getCount();

        return count;
    }

    async markAllAsRead(userId: string) {
        await this.notificationUserRepo
            .createQueryBuilder()
            .update(NotificationUser)
            .set({ isRead: true })
            .where('receiver.id = :userId', { userId })
            .execute();
    }

    async markAsRead(notificationUserId: string) {
        await this.notificationUserRepo
            .createQueryBuilder()
            .update(NotificationUser)
            .set({ isRead: true })
            .where('id = :notificationUserId', { notificationUserId })
            .execute();
    }
}
