import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './user.entity';
import { Posts } from './post.entity';

@Entity()
export class Saved {
    @PrimaryColumn()
    user_id: string;

    @PrimaryColumn()
    post_id: string;

    @ManyToOne(() => Users, (user) => user.savedPosts)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @ManyToOne(() => Posts, (post) => post.savedBy)
    @JoinColumn({ name: 'post_id' })
    post: Posts;
}
