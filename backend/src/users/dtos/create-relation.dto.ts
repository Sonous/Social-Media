import { IsUUID } from 'class-validator';

export class CreateRelationDto {
    @IsUUID()
    currentUserId: string;

    @IsUUID()
    otherUserId: string;
}
