import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { HashtagsModule } from 'src/hashtags/hashtags.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Posts]), forwardRef(() => HashtagsModule), forwardRef(() => AuthModule)],
    exports: [PostsService],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
