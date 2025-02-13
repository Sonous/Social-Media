import { IsUUID } from 'class-validator';

export class CreateInteractionCommentDto {
    @IsUUID()
    user_id: string;

    @IsUUID()
    comment_id: string;
}
