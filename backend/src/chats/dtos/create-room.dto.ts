import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRoomDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsUrl()
    avatar_url: string;

    @IsEnum({
        group: 'group',
        both: 'private',
    })
    type: 'group' | 'private';
}
