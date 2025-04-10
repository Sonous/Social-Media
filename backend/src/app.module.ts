import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Time } from './entities/time.entity';
import { PostsModule } from './posts/posts.module';
import { Posts } from './entities/post.entity';
import { APP_PIPE } from '@nestjs/core';
import { HashtagsModule } from './hashtags/hashtags.module';
import { Hashtags } from './entities/hashtags.entity';
import { Saved } from './entities/saved.entity';
import { SavedModule } from './saved/saved.module';
import { Comments } from './entities/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { ChatsModule } from './chats/chats.module';
import { Rooms } from './entities/room.entity';
import { Messages } from './entities/message.entity';
import { RoomsUsers } from './entities/roomsUsers.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { parse } from 'pg-connection-string';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        TypeOrmModule.forRootAsync({
            useFactory() {
                const dbUrl = process.env.DATABASE_URL || '';
                const config = parse(dbUrl);

                return {
                    type: 'postgres',
                    host: config.host,
                    port: parseInt(config.port || '5432', 10),
                    username: config.user,
                    password: config.password,
                    database: config.database,
                    ssl: { rejectUnauthorized: false },
                    entities: [Users, Time, Posts, Hashtags, Saved, Comments, Rooms, Messages, RoomsUsers],
                };
            },
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        HashtagsModule,
        SavedModule,
        CommentsModule,
        ChatsModule,
        CloudinaryModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        {
            provide: 'DEFAULT_OFFSET',
            useValue: 10,
        },
        {
            provide: 'DEFAULT_LIMIT',
            useValue: 10,
        },
    ],
})
export class AppModule {}
