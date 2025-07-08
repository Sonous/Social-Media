import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGuard } from 'src/chats/socket.guard';

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
export class NotificationGateway {
    @WebSocketServer()
    private server: Server;

    @SubscribeMessage('join-notification')
    handleJoinNotification(@ConnectedSocket() client: Socket) {
        if (client['user'].id) {
            client.join(client['user'].id);
        }
    }

    emitNotificationToUser(userId: string, payload: any) {
        console.log(payload);
        this.server.to(userId).emit('notification', payload);
    }
}
