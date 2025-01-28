import { BadGatewayException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './signin.dto';
import { IsEmail } from 'class-validator';

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
    login(@Body() signInDto: SigninDto) {
        return this.authService.login(signInDto.email, signInDto.password);
    }

    @Get('reset')
    async resetPassword(@Query('email') email: string) {
        return await this.authService.resetPassword(email);
    }
}
