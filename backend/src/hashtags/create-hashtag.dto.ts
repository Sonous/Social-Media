import { IsString, IsUUID } from 'class-validator';

export class CreateHashtagDto {
    @IsUUID()
    id?: string;

    @IsString()
    name: string;
}
