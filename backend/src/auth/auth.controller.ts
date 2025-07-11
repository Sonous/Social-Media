import { BadGatewayException, Body, Controller, Get, ParseBoolPipe, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { Request, Response } from 'express';
import { Public } from './public.decorator';
import { SignUpDto } from './dtos/signUp.dto';
import { ResetDto } from './dtos/reset.dto';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('send-otp')
    async sendOTP(@Query('email') email: string, @Query('isReset', ParseBoolPipe) isReset: boolean) {
        return await this.authService.sendMail(email, isReset);
    }

    @Post('login')
    async login(@Body() signInDto: SigninDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(signInDto.email, signInDto.password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken,
        };
    }

    @Post('signup')
    async signup(@Body() signUpDto: SignUpDto) {
        return await this.authService.signup(signUpDto.user, signUpDto.otp);
    }

    @Post('reset')
    async resetPassword(@Body() { email, otp, password }: ResetDto) {
        return await this.authService.resetPassword(email, otp, password);
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

    @Get('me')
    async authMe(@Req() req: Request) {
        const refreshToken = req.cookies['refreshToken'];

        return await this.authService.authMe(refreshToken);
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    }
}
