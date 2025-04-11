import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

enum TokenErrorType {
    EXPIRED = 'EXPIRED',
    INVALID = 'INVALID',
    NOPROVIDED = 'NOPROVIDED',
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);

        if (!token) {
            throw new UnauthorizedException({
                message: 'No token provided',
                errorType: TokenErrorType.NOPROVIDED,
                statusCode: 401,
            });
        }

        try {
            const payload: TokenPayload = await this.jwtService.verifyAsync(token);
            if (payload.tokenType !== 'accessToken') {
                throw new UnauthorizedException({
                    message: 'Invalid token type',
                    errorType: TokenErrorType.INVALID,
                    statusCode: 401,
                });
            }

            req['user'] = payload.user;
        } catch (error) {
            throw new UnauthorizedException({
                message: error.message,
                errorType: TokenErrorType.EXPIRED,
                statusCode: 401,
            });
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
