import { Time } from 'src/entities/time.entity';
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

    @Column()
    password: string;

    @Column()
    avatar_url: string;

    @Column()
    bio: string;

    @OneToMany(() => Posts, (post) => post.user, {
        cascade: true,
    })
    posts: Posts[];

    @ManyToMany(() => Users, (user) => user.following)
    @JoinTable({
        name: 'followers',
        joinColumn: {
            name: 'self_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'follower_id',
            referencedColumnName: 'id',
        },
    })
    followers: Users[];

    @ManyToMany(() => Users, (user) => user.followers)
    following: Users[];

    @CreateDateColumn({ type: 'timestamp', default: new Date() })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: new Date() })
    updated_at: Date;
}
