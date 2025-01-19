import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Posts])],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
