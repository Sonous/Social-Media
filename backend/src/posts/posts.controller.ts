import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateInteractionDto } from './dtos/create-interaction.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { Public } from 'src/auth/public.decorator';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Post()
    async addPost(@Body() post: CreatePostDto) {
        return await this.postsService.addPost(post);
    }

    @Get()
    @Public()
    async getAllPosts(@Query('page') page: number) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.postsService.getAllPosts(page);
    }

    @Get('/users/:userId')
    async getPostsByUserId(@Param('userId') userId: string, @Query('page') page: number) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.postsService.getPostsByUserId(userId, page);
    }

    // Interaciton
    @Post('interactions')
    async addPostInteraction(@Body() interaction: CreateInteractionDto) {
        return await this.postsService.addPostInteraction(interaction.post_id, interaction.user_id);
    }

    @Delete('interactions')
    async removePostInteraction(@Query() { post_id, user_id }: CreateInteractionDto) {
        return await this.postsService.removePostInteraction(post_id, user_id);
    }

    @Get('check-interaction')
    async checkInteraction(@Query() { post_id, user_id }: CreateInteractionDto) {
        return await this.postsService.checkInteraction(post_id, user_id);
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return await this.postsService.getPostById(id);
    }

    @Get('detail/:id')
    @Public()
    async getPostDetailById(@Param('id') id: string) {
        return await this.postsService.getPostDetailById(id);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string, @Req() req: Request) {
        return await this.postsService.deletePost(id, req['user'].id);
    }
}
