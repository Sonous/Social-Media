import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsUUID()
    id?: string;

    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    avatar_url: string;

    @IsString()
    bio: string;
}
