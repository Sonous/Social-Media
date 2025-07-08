import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { HashtagsModule } from 'src/hashtags/hashtags.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Posts]),
        forwardRef(() => HashtagsModule),
        forwardRef(() => AuthModule),
        UsersModule,
        NotificationModule,
    ],
    exports: [PostsService],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
