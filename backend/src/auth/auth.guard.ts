import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

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
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload: TokenPayload = await this.jwtService.verifyAsync(token);
            if (payload.tokenType !== 'accessToken') {
                throw new UnauthorizedException('Invalid token type');
            }

            req['user'] = payload.user;
        } catch (error) {
            throw new UnauthorizedException(error);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
