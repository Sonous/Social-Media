import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { MediaType } from 'src/posts/dtos/create-post.dto';

export class CreateMessageDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => MediaType)
    medias: MediaType[];

    @IsUUID()
    user_id: string;

    @IsUUID()
    room_id: string;
}
