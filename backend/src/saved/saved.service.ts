import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { Saved } from 'src/entities/saved.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SavedService {
    private defaultOffset: number = DEFAULT_OFFSET;
    private defaultLimit: number = DEFAULT_LIMIT;

    constructor(@InjectRepository(Saved) private savedRepository: Repository<Saved>) {}

    async getSavedPostsByUserId(userId: string, page: number) {
        const offset = page * this.defaultOffset - this.defaultOffset;
        const limit = this.defaultLimit;

        const [savedPosts, quantity] = await this.savedRepository.findAndCount({
            relations: {
                post: true,
            },
            where: {
                user_id: userId,
            },
            skip: offset,
            take: limit,
        });

        return {
            savedPosts,
            totalPage: Math.ceil(quantity / limit),
        };
    }
}
