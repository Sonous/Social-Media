import { IsUUID } from 'class-validator';

export class CreateInteractionDto {
    @IsUUID()
    post_id: string;

    @IsUUID()
    user_id: string;
}
