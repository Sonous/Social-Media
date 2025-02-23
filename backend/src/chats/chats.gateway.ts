import {
    ConnectedSocket,
    MessageBody,
    // OnGatewayConnection,
    // OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { JoinRoomDto } from './dtos/join-room.dto';

@WebSocketGateway(3030, { cors: true })
export class ChatGateWay {
    @WebSocketServer() server: Server;

    constructor(private chatsService: ChatsService) {}

    @UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors), transform: true }))
    @SubscribeMessage('join-room')
    async handleJoinRoom(@MessageBody() { room_id, user_id }: JoinRoomDto, @ConnectedSocket() client: Socket) {
        if (!room_id || !user_id) {
            return {
                message: 'Invalid room or user',
            };
        }

        const { permission, message } = await this.chatsService.checkPermission(room_id, user_id);

        if (!permission) {
            return {
                message,
            };
        }

        console.log('Joining room', room_id);
        client.join(room_id);
        return {
            message: 'Joined room successfully',
        };
    }

    @UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors), transform: true }))
    @SubscribeMessage('send-message')
    async handleSendMessage(@MessageBody() message: CreateMessageDto, @ConnectedSocket() client: Socket) {
        console.log(message);
        if (!message.room_id || !message.user_id || !message.content) {
            return {
                message: 'Missing required fields',
            };
        }

        try {
            const newMessage = await this.chatsService.createMessage(message);
            this.server.to(message.room_id).emit('new-message', newMessage);
            return {
                message: 'Message sent successfully',
                data: newMessage,
            };
        } catch (error) {
            console.log(error);
            return {
                message: 'Failed to send message',
                error,
            };
        }
    }
}
