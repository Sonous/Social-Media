import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class SocketGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToWs().getClient<Socket>();
        const authHeader = request.handshake.headers['authorization'];

        if (!authHeader) {
            throw new WsException('Missing authorization header');
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            throw new WsException('Invalid token');
        }

        try {
            const payload = this.jwtService.verify(token);
            request['user'] = payload.user; // attach user to socket if needed
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new WsException({
                    message: 'Token expired',
                    statusCode: 401,
                });
            } else {
                throw new WsException({
                    message: 'Invalid token',
                    statusCode: 401,
                });
            }
        }
    }
}
