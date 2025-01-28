import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './create-hashtag.dto';

@Controller('hashtags')
export class HashtagsController {
    constructor(private hashtagsService: HashtagsService) {}

    @Get()
    async findHashtagByName(@Query('name') name: string) {
        return await this.hashtagsService.findHashtagByName(name);
    }

    @Post()
    async addHashtag(@Body() hashtag: CreateHashtagDto) {
        return await this.hashtagsService.addHashtag(hashtag);
    }
}
