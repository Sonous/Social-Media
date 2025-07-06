import { IsUUID } from 'class-validator';
export class RecoveryMessageDto {
    @IsUUID()
    user_id: string;
    @IsUUID()
    message_id: string;
}
