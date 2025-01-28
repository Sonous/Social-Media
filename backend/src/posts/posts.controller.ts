import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return await this.postsService.getPostById(id);
    }
}
