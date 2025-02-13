import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { Post } from './post.interface';
import { HashtagsService } from 'src/hashtags/hashtags.service';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';

@Injectable()
export class PostsService {
    private defaultOffset: number = DEFAULT_OFFSET;
    private defaultLimit: number = DEFAULT_LIMIT;

    constructor(
        @InjectRepository(Posts) private postsRepository: Repository<Posts>,
        private hashtagsService: HashtagsService,
    ) {}

    async addPost(post: Post) {
        post.content = post.content.replace(/\n\s*\n/g, '\n');
        const words = post.content.split(/\s+/);
        const hashtags = words
            .filter((word) => word.startsWith('#'))
            .flatMap((word) => {
                const splitString = word.split('#');
                splitString.shift();

                return splitString;
            })
            .map((word) => {
                const matches = word.match(/\[(.*?)\]\((.*?)\)/);

                if (matches) {
                    return {
                        id: matches[2],
                        name: matches[1],
                    };
                } else {
                    return {
                        name: word,
                    };
                }
            });

        // Save post
        const {
            identifiers: [{ id: postId }],
        } = await this.postsRepository.createQueryBuilder('post').insert().into(Posts).values(post).execute();

        // Save hashtags
        for (const hashtag of hashtags) {
            if (!hashtag.id) {
                const existingHashtag = await this.hashtagsService.findHashtagByName(hashtag.name);

                if (!existingHashtag) {
                    const { id: hashtagId } = await this.hashtagsService.addHashtag(hashtag);
                    hashtag.id = hashtagId;
                } else {
                    hashtag.id = existingHashtag.id;
                }
            }

            await this.postsRepository
                .createQueryBuilder('post')
                .relation(Posts, 'hashtags')
                .of(postId)
                .add(hashtag.id);
        }

        return {
            message: 'success',
        };
    }

    async getPostById(id: string) {
        return await this.postsRepository.findOneBy({ id });
    }

    async getPostsByUserId(userId: string, page: number) {
        const offset = page * this.defaultOffset - this.defaultOffset;
        const limit = this.defaultLimit;

        const [posts, quantity] = await this.postsRepository.findAndCount({
            where: {
                user_id: userId,
            },
            order: {
                created_at: 'DESC',
            },
            take: limit,
            skip: offset,
        });

        return {
            posts,
            totalPage: Math.ceil(quantity / limit),
        };
    }

    async getAllPosts(page: number) {
        const offset = page * this.defaultOffset - this.defaultOffset;
        const limit = this.defaultLimit;

        const posts = await this.postsRepository.find({
            take: limit,
            skip: offset,
        });

        return posts;
    }

    async addPostInteraction(post_id: string, user_id: string) {
        const interaction = await this.checkInteraction(post_id, user_id);

        if (interaction) {
            throw new ConflictException('The interaction has already existed');
        }

        await this.postsRepository
            .createQueryBuilder('post')
            .relation(Posts, 'userInteractions')
            .of(post_id)
            .add(user_id);

        return {
            status: 'add success',
            data: {
                post_id,
                user_id,
            },
        };
    }

    async removePostInteraction(post_id: string, user_id: string) {
        const interaction = await this.checkInteraction(post_id, user_id);

        if (!interaction) {
            throw new NotFoundException('Not found interaction!');
        }

        await this.postsRepository
            .createQueryBuilder('post')
            .relation(Posts, 'userInteractions')
            .of(post_id)
            .remove(user_id);

        return {
            status: 'remove success',
            data: {
                post_id,
                user_id,
            },
        };
    }

    async checkInteraction(post_id: string, user_id: string) {
        const interaction = await this.postsRepository
            .createQueryBuilder('post')
            .innerJoin('post.userInteractions', 'userInteraction', 'userInteraction.id = :user_id', { user_id })
            .select(['post.id', 'userInteraction.id'])
            .where('post.id = :post_id', { post_id })
            .getRawOne();

        if (!interaction) {
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
