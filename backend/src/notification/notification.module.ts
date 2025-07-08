import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { NotificationUser } from 'src/entities/notification-user.entity';
import { UsersModule } from 'src/users/users.module';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, NotificationUser]),
        forwardRef(() => UsersModule),
        forwardRef(() => AuthModule),
    ],
    exports: [NotificationService],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
