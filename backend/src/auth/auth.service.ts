import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { totp } from 'otplib';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly mailService: MailerService,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private jwtService: JwtService,
    ) {
        totp.options = {
            step: 60,
            digits: 6,
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

    verifyOtp(otp: string): boolean {
        return totp.check(otp, process.env.OTP_SECRET_KEY);
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
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();

        if (!user) {
            throw new NotFoundException('User not found');
        }

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
                expiresIn: '1m',
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

    async verifyRefreshToken(token: string) {
        const payload: TokenPayload = await this.jwtService.verifyAsync(token);

        if (payload.tokenType !== 'refreshToken') {
            throw new UnauthorizedException('Invalid token type! Expected refresh token');
        }

        const user = await this.usersRepository.findOneBy({ id: payload.user.id });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        delete user.password; // Remove password from user object

        const accessToken = await this.jwtService.signAsync(
            {
                user: { ...user },
                tokenType: 'accessToken',
            },
            {
                expiresIn: '1m',
            },
        );

        return accessToken;
    }

    async signUp(email: string) {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();

        if (user) {
            throw new UnauthorizedException('Email already exists');
        }

        await this.sendOtp(email);
    }

    async resetPassword(email: string) {
        const user: Users = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.sendOtp(email);

        return {
            userId: user.id,
        };
    }
}
