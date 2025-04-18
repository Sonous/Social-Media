import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Posts } from './post.entity';
import { Saved } from './saved.entity';
import { Comments } from './comment.entity';
import { Messages } from './message.entity';
import { RoomsUsers } from './roomsUsers.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    // @Column({ select: false })
    @Column()
    password: string;

    @Column()
    avatar_url: string;

    @Column()
    bio: string;

    @OneToMany(() => Posts, (post) => post.user)
    posts: Posts[];

    @ManyToMany(() => Users, (user) => user.followers)
    @JoinTable({
        name: 'relations',
        joinColumn: {
            name: 'follower_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'following_id',
            referencedColumnName: 'id',
        },
    })
    following: Users[];

    @ManyToMany(() => Users, (user) => user.following, {
        cascade: true,
    })
    followers: Users[];

    @OneToMany(() => Saved, (saved) => saved.user)
    savedPosts: Saved[];

    @ManyToMany(() => Posts, (post) => post.userInteractions)
    interactedPosts: Posts[];

    @OneToMany(() => Comments, (comment) => comment.user)
    comments: Comments[];

    @ManyToMany(() => Comments, (comment) => comment.interactedUsers)
    interactedComments: Comments[];

    @OneToMany(() => Messages, (message) => message.sender)
    messages: Messages[];

    @OneToMany(() => RoomsUsers, (roomUser) => roomUser.user)
    roomsUsers: RoomsUsers[];

    @CreateDateColumn({ type: 'timestamp', default: new Date() })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: new Date() })
    updated_at: Date;
}
