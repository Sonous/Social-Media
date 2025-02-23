import { IsUUID } from 'class-validator';

export class JoinRoomDto {
    @IsUUID()
    room_id: string;

    @IsUUID()
    user_id: string;
}
