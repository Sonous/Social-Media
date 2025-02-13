import { ArrayNotEmpty, IsArray, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { MediaType } from 'src/posts/dtos/create-post.dto';
import { MentionDto } from './mention.dto';
import { Type } from 'class-transformer';

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsObject()
    @IsOptional()
    media?: MediaType;

    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MentionDto)
    mentions: MentionDto[];

    @IsUUID()
    post_id: string;

    @IsUUID()
    user_id: string;

    @IsUUID()
    @IsOptional()
    parent_comment_id?: string;
}
