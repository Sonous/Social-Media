import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { Post } from './post.interface';
import { HashtagsService } from 'src/hashtags/hashtags.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private postsRepository: Repository<Posts>,
        private hashtagsService: HashtagsService,
    ) {}

    async addPost(post: Post) {
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
                const { id: hashtagId } = await this.hashtagsService.addHashtag(hashtag);
                hashtag.id = hashtagId;
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
}
