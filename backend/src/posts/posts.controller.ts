import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { JwtGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @UseGuards(JwtGuard)
    @Post()
    async addPost(@Body() post: CreatePostDto) {
        return await this.postsService.addPost(post);
    }

    @Get('/users/:userId')
    async getPostsByUserId(@Param('userId') userId: string, @Query('page') page: number) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.postsService.getPostsByUserId(userId, page);
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return await this.postsService.getPostById(id);
    }
}
