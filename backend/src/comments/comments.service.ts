import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { Comment } from './interfaces/comments.interface';

@Injectable()
export class CommentsService {
    private defaultOffset: number = DEFAULT_OFFSET;
    private defaultLimit: number = DEFAULT_LIMIT;
    constructor(@InjectRepository(Comments) private commentsRepository: Repository<Comments>) {}

    // Lấy ra số lượng comment của một post
    async getPostCommentsAmount(post_id: string) {
        const count = await this.commentsRepository
            .createQueryBuilder('comment')
            .select("COUNT(*) as 'amount'")
            .where('comment.post_id = :post_id', { post_id })
            .getRawOne();

        return {
            ...count,
            post_id,
        };
    }

    async addComment(comment: Comment) {
        if (comment.parent_comment_id && !comment.mentions) {
            throw new BadRequestException('Comment have to include mentions if parent_comment_id exist');
        } else if (!comment.parent_comment_id && comment.mentions) {
            throw new BadRequestException('Comment have to include parent_comment_id if mentions exist');
        }

        const newComment = this.commentsRepository
            .createQueryBuilder()
            .insert()
            .into(Comments)
            .values(comment)
            .execute();

        return newComment;
    }

    // Lấy ra các comment cha của post
    async getPostComments(post_id: string, page: number) {
        const offset = page * this.defaultOffset - this.defaultOffset;
        const limit = this.defaultLimit;

        const comments = await this.commentsRepository
            .createQueryBuilder('comment')
            .innerJoin('comment.user', 'commentOwner')
            .select(['comment', 'commentOwner.name', 'commentOwner.username', 'commentOwner.avatar_url'])
            .where('comment.post_id = :post_id', { post_id })
            .andWhere('comment.parent_comment_id is null')
            .offset(offset)
            .limit(limit)
            .getMany();

        const updatedCommentPromise = comments.map(async (comment) => {
            const childAmount = await this.commentsRepository
                .createQueryBuilder('comment')
                .select(['COUNT(*) as amount'])
                .where('comment.parent_comment_id = :id', { id: comment.id })
                .getRawOne();

            return {
                ...comment,
                childAmount: parseInt(childAmount.amount),
            };
        });

        const updateComments = await Promise.all(updatedCommentPromise);

        return updateComments;
    }

    // Lấy ra các comment con của một comment
    async getChildComments(parent_comment_id: string, page: number) {
        const offset = page * this.defaultOffset - this.defaultOffset;
        const limit = this.defaultLimit;

        const childComments = await this.commentsRepository
            .createQueryBuilder('comment')
            .innerJoin('comment.user', 'commentOwner')
            .select(['comment', 'commentOwner.name', 'commentOwner.username', 'commentOwner.avatar_url'])
            .where('comment.parent_comment_id = :parent_comment_id', { parent_comment_id })
            .offset(offset)
            .limit(limit)
            .getMany();

        return childComments;
    }

    // Xóa Comment
    async removeComment(comment_id: string) {
        const comment = await this.commentsRepository.findOne({
            where: {
                id: comment_id,
            },
        });

        if (!comment) {
            throw new NotFoundException('Not found comment');
        }

        await this.commentsRepository
            .createQueryBuilder()
            .delete()
            .from(Comments)
            .where('id = :comment_id', { comment_id })
            .execute();
    }

    // Thêm like cho comment
    async addHeartToComment(user_id: string, comment_id: string) {
        await this.commentsRepository
            .createQueryBuilder()
            .relation(Comments, 'interactedUsers')
            .of(comment_id)
            .add(user_id);
    }

    // Hủy like cho comment
    async removeHeartToComment(user_id: string, comment_id: string) {
        await this.commentsRepository
            .createQueryBuilder()
            .relation(Comments, 'interactedUsers')
            .of(comment_id)
            .remove(user_id);
    }

    async getCommentById(comment_id: string) {
        const comment = await this.commentsRepository
            .createQueryBuilder('comment')
            .innerJoin('comment.user', 'commentOwner')
            .select(['comment', 'commentOwner.name', 'commentOwner.username', 'commentOwner.avatar_url'])
            .where('comment.id = :comment_id', { comment_id })
            .getOne();

        if (!comment) {
            throw new NotFoundException("Comment doesn't exist");
        }

        return comment;
    }
}
