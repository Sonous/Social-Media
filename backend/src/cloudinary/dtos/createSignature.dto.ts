import { IsEnum, IsString } from 'class-validator';

export class CreateSignatureDto {
    @IsString()
    userId: string;

    @IsEnum({
        avatars: 'avatars',
        posts: 'posts',
    })
    folder: FolderType;
}
