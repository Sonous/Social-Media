import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { CreateUserIdsDto } from './dtos/create-userIds.dto';

@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}

    @Post()
    async createNewChatRoom(@Body('room') room: CreateRoomDto, @Body('userIds') userIds: CreateUserIdsDto['userIds']) {
        return await this.chatsService.createRoom(room, userIds);
    }

    @Get('private')
    async getRoomPrivate(@Query('currentUserId') currentUserId: string, @Query('otherUserId') otherUserId: string) {
        return await this.chatsService.getRoomPrivate(currentUserId, otherUserId);
    }

    @Get('user/:userId')
    async getRoomsByUserId(@Param('userId') userId: string) {
        return await this.chatsService.getRoomsByUserId(userId);
    }

    @Get('check-room/:roomId')
    async checkRoomExists(@Param('roomId') roomId: string) {
        return await this.chatsService.checkRoomExists(roomId);
    }

    @Get('room/:roomId')
    async getRoomById(@Param('roomId') roomId: string) {
        return await this.chatsService.getRoomById(roomId);
    }

    @Get('message/:roomId')
    async getMessagesByRoomId(@Param('roomId') roomId: string) {
        return await this.chatsService.getMessagesByRoomId(roomId);
    }
}
