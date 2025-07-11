import { MailerService } from '@nestjs-modules/mailer';
import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { totp } from 'otplib';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly mailService: MailerService,
        @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {
        totp.options = {
            step: 60,
            digits: 6,
            window: 1,
        };
    }

    sendOtp(toEmail: string): Promise<any> {
        const otp = totp.generate(process.env.OTP_SECRET_KEY);

        return this.mailService.sendMail({
            to: toEmail,
            subject: `Verify email through OTP`,
            template: './otpTemplate',
            context: {
                otp,
            },
        });
    }

    verifyOtp(otp: string) {
        const isValid = totp.check(otp, process.env.OTP_SECRET_KEY);

        if (!isValid) {
            throw new BadRequestException('Invalid OTP');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10; // Số vòng để tạo salt (mặc định 10)
        const salt = await bcrypt.genSalt(saltRounds); // Tạo salt
        const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu
        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userService.getUserBy({ email }, true);

        const isMatch = await this.comparePassword(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password');
        }

        // Generate access and refresh tokens
        delete user.password; // Remove password from user object

        const payload = {
            user: {
                ...user,
            },
        };
        const accessToken = await this.jwtService.signAsync(
            {
                ...payload,
                tokenType: 'accessToken',
            },
            {
                expiresIn: '15m',
            },
        );
        const refreshToken = await this.jwtService.signAsync(
            {
                ...payload,
                tokenType: 'refreshToken',
            },
            {
                expiresIn: '7d',
            },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async signup(user: CreateUserDto, otp: string) {
        this.verifyOtp(otp);

        await this.userService.addUser(user);
    }

    async verifyRefreshToken(token: string) {
        try {
            const payload: TokenPayload = await this.jwtService.verifyAsync(token);

            if (payload.tokenType !== 'refreshToken') {
                throw new UnauthorizedException('Invalid token type! Expected refresh token');
            }

            const user = await this.userService.getUserBy({ id: payload.user.id });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const accessToken = await this.jwtService.signAsync(
                {
                    user: { ...user },
                    tokenType: 'accessToken',
                },
                {
                    expiresIn: '15m',
                },
            );

            return accessToken;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    async sendMail(email: string, isReset: boolean) {
        const user = await this.userService.checkUserBy({ email });

        // console.log(user);
        // console.log(isReset);
        // console.log(user && !isReset);
        if (user && !isReset) {
            throw new UnauthorizedException('Email already exists');
        } else if (!user && isReset) {
            throw new NotFoundException('Email not found');
        }

        await this.sendOtp(email);
    }

    async resetPassword(email: string, otp: string, password: string) {
        this.verifyOtp(otp);
        const user = await this.userService.getUserBy({ email });

        if (!user) {
            throw new NotFoundException('Email not found');
        }
        await this.userService.updateUserById(user.id, { password });
    }

    async authMe(refreshToken: string): Promise<boolean> {
        try {
            const payload: TokenPayload = await this.jwtService.verifyAsync(refreshToken);

            if (payload.tokenType !== 'refreshToken') {
                return false;
            }

            return true;
        } catch (error) {
            console.log('Error verifying refresh token:', error);
            return false;
        }
    }
}
