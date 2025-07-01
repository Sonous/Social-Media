import { Module } from '@nestjs/common';
import { ChatGateWay } from './chats.gateway';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from 'src/entities/room.entity';
import { Messages } from 'src/entities/message.entity';
import { RoomsUsers } from 'src/entities/roomsUsers.entity';
import { ChatsController } from './chats.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Rooms, Messages, RoomsUsers]), UsersModule, AuthModule],
    providers: [ChatGateWay, ChatsService],
    controllers: [ChatsController],
})
export class ChatsModule {}
