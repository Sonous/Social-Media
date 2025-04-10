import { IsEmail, IsString } from 'class-validator';

export class ResetDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    password: string;
}
