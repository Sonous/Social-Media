import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification.entity';
import { Users } from './user.entity';

@Entity({
    name: 'notification_user',
})
export class NotificationUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @PrimaryColumn({
        name: 'is_read',
        type: 'boolean',
        default: false,
    })
    isRead: boolean;

    @ManyToOne(() => Notification, {
        cascade: true,
    })
    @JoinColumn({
        name: 'notification_id',
    })
    notification: Notification;

    @ManyToOne(() => Users, {
        cascade: true,
    })
    @JoinColumn({
        name: 'user_id',
    })
    receiver: Users;
}
