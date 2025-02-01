import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, IsUrl, ValidateNested } from 'class-validator';

export class CreatePostDto {
    @IsString()
    content: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaType)
    medias: MediaType[];

    @IsString()
    userId: string;
}

export class MediaType {
    @IsEnum({
        image: 'image',
        video: 'video',
    })
    type: 'image' | 'video';

    @IsUrl()
    url: string;
}
