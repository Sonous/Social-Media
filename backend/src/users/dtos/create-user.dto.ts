import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsUUID()
    @IsOptional()
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
    @IsOptional()
    avatar_url: string;

    @IsString()
    @IsOptional()
    bio: string;
}
