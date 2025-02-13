import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Posts } from './post.entity';
import { Time } from './time.entity';
import { MediaType } from 'src/posts/post.interface';
import { Mention } from 'src/comments/interfaces/mention.interface';

@Entity()
export class Comments extends Time {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column('text', {
        transformer: {
            to: (value: string[]) => JSON.stringify(value),
            from: (value: string) => JSON.parse(value),
        },
    })
    media: MediaType;

    @Column('text', {
        transformer: {
            to: (value: string[]) => JSON.stringify(value),
            from: (value: string) => JSON.parse(value),
        },
    })
    mentions: Mention[];

    @Column()
    post_id: string;

    @Column()
    user_id: string;

    @Column({ nullable: true })
    parent_comment_id: string;

    @ManyToOne(() => Posts, (post) => post.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Posts;

    @ManyToOne(() => Users, (user) => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @OneToMany(() => Comments, (comment) => comment.parentComment, {
        cascade: true,
    })
    childComments: Comments[];

    @ManyToOne(() => Comments, (comment) => comment.childComments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_comment_id' })
    parentComment: Comments;

    @ManyToMany(() => Users, (user) => user.interactedComments, {
        cascade: true,
    })
    @JoinTable({
        name: 'users_comments',
        joinColumn: {
            name: 'comment_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    interactedUsers: Users[];
}
