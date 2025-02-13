import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comments])],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule {}
