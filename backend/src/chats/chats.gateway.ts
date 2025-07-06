import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { SocketGuard } from './socket.guard';
import { RecoveryMessageDto } from './dtos/recovery-message.dto';

@UsePipes(
    new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => new WsException(errors),
    }),
)
@WebSocketGateway(3030, {
    cors: {
        origin: process.env.ORIGIN_CORS || 'http://localhost:5173', // hoặc domain frontend của bạn
        credentials: true,
    },
})
@UseGuards(SocketGuard)
export class ChatGateWay {
    @WebSocketServer()
    private server: Server;

    constructor(private chatsService: ChatsService) {}

    @SubscribeMessage('join-room')
    async handleJoinRoom(@MessageBody() { room_id, user_id }: JoinRoomDto, @ConnectedSocket() client: Socket) {
        try {
            const { permission, message } = await this.chatsService.checkPermission(room_id, user_id);

            if (!permission) {
                throw new WsException(message);
            }

            console.log('Joining room', room_id);
            client.join(room_id);
        } catch (error) {
            throw new WsException({
                message: error.message || 'An error occurred while joining the room',
                statusCode: 400,
            });
        }
    }

    @SubscribeMessage('send-message')
    async handleSendMessage(@MessageBody() message: CreateMessageDto, @ConnectedSocket() client: Socket) {
        try {
            console.log('Received message:', message);
            const newMessage = await this.chatsService.createMessage(message);
            this.server.to(message.room_id).emit('new-message', newMessage);
            return {
                message: 'Message sent successfully',
                data: newMessage,
            };
        } catch (error) {
            client.leave(message.room_id);
            throw new WsException({
                message: error.message || 'An error occurred while sending the message',
                statusCode: 400,
            });
        }
    }

    @SubscribeMessage('recovery-message')
    async handleRecoveryMessage(@MessageBody() recoveryMessageDto: RecoveryMessageDto) {
        try {
            const message = await this.chatsService.verifyMessageOwnership(
                recoveryMessageDto.message_id,
                recoveryMessageDto.user_id,
            );

            const updatedMessage = await this.chatsService.updateMessageStatus(message.id, 'recovery');

            this.server.to(message.room_id).emit('recovery-message', updatedMessage);
        } catch (error) {
            throw new WsException({
                message: error.message || 'An error occurred while sending the message',
                statusCode: 400,
            });
        }
    }
}
