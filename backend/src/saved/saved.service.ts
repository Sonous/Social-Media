import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    async savePost(post_id: string, user_id: string) {
        const savedPost = await this.checkSavedPost(post_id, user_id);

        if (savedPost.isExists) {
            throw new ConflictException('This one has already existed.');
        }

        const newSavedPost = this.savedRepository.create({
            post_id,
            user_id,
        });

        await this.savedRepository.save(newSavedPost);

        return newSavedPost;
    }

    async removeSavedPost(post_id: string, user_id: string) {
        const savedPost = await this.checkSavedPost(post_id, user_id);

        if (!savedPost.isExists) {
            throw new NotFoundException('Not found');
        }

        const newSavedPost = await this.savedRepository.delete({
            post_id,
            user_id,
        });

        return newSavedPost;
    }

    async checkSavedPost(post_id: string, user_id: string) {
        const savedPost = await this.savedRepository.findOne({
            where: {
                post_id,
                user_id,
            },
        });

        if (!savedPost) {
            return {
                isExists: false,
            };
        } else {
            return {
                isExists: true,
            };
        }
    }
}
