import { Time } from 'src/entities/time.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './post.entity';

@Entity()
export class Users extends Time {
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
}
