import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/createCommentDto.dto';
import { CreateInteractionCommentDto } from './dtos/interaction-comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Post()
    async addComment(@Body() comment: CreateCommentDto) {
        return await this.commentsService.addComment(comment);
    }

    @Get()
    async getPostComments(@Query() { post_id, page }: { post_id: string; page: number }) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.commentsService.getPostComments(post_id, page);
    }

    @Get('children')
    async getChildComments(@Query() { parent_comment_id, page }: { parent_comment_id: string; page: number }) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.commentsService.getChildComments(parent_comment_id, page);
    }

    @Get('count-comment')
    async getPostCommentAmount(@Query('post_id') post_id: string) {
        return this.commentsService.getPostCommentsAmount(post_id);
    }

    @Post('heart-comment')
    async addHeartToComment(@Body() { user_id, comment_id }: CreateInteractionCommentDto) {
        return this.commentsService.addHeartToComment(user_id, comment_id);
    }

    @Delete('heart-comment')
    async removeHeartToComment(@Query() { user_id, comment_id }: CreateInteractionCommentDto) {
        return this.commentsService.removeHeartToComment(user_id, comment_id);
    }

    @Get(':comment_id')
    async getCommentById(@Param('comment_id') comment_id: string) {
        return await this.commentsService.getCommentById(comment_id);
    }
    @Delete(':comment_id')
    async removeComment(@Param('comment_id') comment_id: string) {
        return await this.commentsService.removeComment(comment_id);
    }
}
