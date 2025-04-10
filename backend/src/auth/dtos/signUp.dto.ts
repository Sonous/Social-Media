import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export class SignUpDto {
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;

    @IsString()
    otp: string;
}
