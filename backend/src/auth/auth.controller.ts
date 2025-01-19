import { BadGatewayException, Body, Controller, Get, NotAcceptableException, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('send-otp')
    async sendMail(@Query('email') email: string) {
        try {
            const message = await this.authService.sendOtp(email);

            return {
                message: message,
            };
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    @Get('verify-otp')
    verifyOtp(@Query('otp') otp: string) {
        const isValid = this.authService.verifyOtp(otp);

        return { isValid };
    }
}
