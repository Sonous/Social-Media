import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateUserIdsDto {
    @IsArray()
    @ArrayNotEmpty()
    userIds: string[];
}
