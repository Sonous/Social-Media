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

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: 'mini_social_media',
            entities: [Users, Posts, Hashtags, Saved, Comments],
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        HashtagsModule,
        SavedModule,
        CommentsModule,
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
