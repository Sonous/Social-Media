import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { SavedService } from './saved.service';
import { CreateInteractionDto } from 'src/posts/dtos/create-interaction.dto';

@Controller('saved')
export class SavedController {
    constructor(private savedService: SavedService) {}

    @Post()
    async savePost(@Body() { post_id, user_id }: CreateInteractionDto) {
        return await this.savedService.savePost(post_id, user_id);
    }

    @Delete()
    async removeSavedPost(@Query() { post_id, user_id }: CreateInteractionDto) {
        return await this.savedService.removeSavedPost(post_id, user_id);
    }

    @Get('check-saved')
    async checkSavedPost(@Query() { post_id, user_id }: CreateInteractionDto) {
        return await this.savedService.checkSavedPost(post_id, user_id);
    }

    @Get('users/:userId')
    async getSavedPostsByUserId(@Param('userId') userId: string, @Query('page') page: number) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.savedService.getSavedPostsByUserId(userId, page);
    }
}
