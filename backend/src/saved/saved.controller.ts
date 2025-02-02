import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { SavedService } from './saved.service';

@Controller('saved')
export class SavedController {
    constructor(private savedService: SavedService) {}

    @Get('users/:userId')
    async getSavedPostsByUserId(@Param('userId') userId: string, @Query('page') page: number) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.savedService.getSavedPostsByUserId(userId, page);
    }
}
