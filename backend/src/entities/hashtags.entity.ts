import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './post.entity';

@Entity()
export class Hashtags {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Posts, (posts) => posts.hashtags)
    posts: Posts[];
}
