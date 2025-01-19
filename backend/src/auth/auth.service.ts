import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { totp } from 'otplib';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly mailService: MailerService) {
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
}
