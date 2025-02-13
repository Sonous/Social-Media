import { IsString, IsUUID } from 'class-validator';

export class MentionDto {
    @IsUUID()
    user_id: string;

    @IsString()
    username: string;
}
