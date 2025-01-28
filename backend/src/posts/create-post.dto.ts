import { IsArray, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    content: string;

    @IsArray()
    medias: string[];

    @IsString()
    userId: string;
}
