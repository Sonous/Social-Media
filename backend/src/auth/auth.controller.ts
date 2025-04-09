import {
    BadGatewayException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './signin.dto';
import { Request, Response } from 'express';
import { Public } from './public.decorator';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('signup')
    async sendMail(@Query('email') email: string) {
        return await this.authService.signUp(email);
    }

    @Get('verify-otp')
    verifyOtp(@Query('otp') otp: string) {
        const isValid = this.authService.verifyOtp(otp);

        return { isValid };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() signInDto: SigninDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(signInDto.email, signInDto.password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            accessToken,
        };
    }

    @Get('refresh-token')
    async refreshToken(@Req() req: Request) {
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            throw new BadGatewayException('Refresh token not found');
        }

        const accessToken = await this.authService.verifyRefreshToken(refreshToken);

        return {
            accessToken,
        };
    }

    @Get('reset')
    async resetPassword(@Query('email') email: string) {
        return await this.authService.resetPassword(email);
    }
}
