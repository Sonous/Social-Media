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
            entities: [Users, Posts, Hashtags],
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        HashtagsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {}
