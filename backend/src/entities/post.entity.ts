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
import { Time } from './time.entity';
import { Users } from './user.entity';
import { Hashtags } from './hashtags.entity';
import { MediaType } from 'src/posts/post.interface';
import { Saved } from './saved.entity';

@Entity()
export class Posts extends Time {
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
    medias: MediaType[];

    @Column()
    user_id: string;

    @ManyToOne(() => Users, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @ManyToMany(() => Hashtags, (hashtags) => hashtags.posts)
    @JoinTable({
        name: 'posts_hashtags',
        joinColumn: {
            name: 'post_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'hashtag_id',
            referencedColumnName: 'id',
        },
    })
    hashtags: Hashtags[];

    @OneToMany(() => Saved, (saved) => saved.post)
    // @JoinTable({
    //     name: 'saved',
    //     joinColumn: {
    //         name: 'post_id',
    //         referencedColumnName: 'id',
    //     },
    //     inverseJoinColumn: {
    //         name: 'user_id',
    //         referencedColumnName: 'id',
    //     },
    // })
    savedBy: Saved[];
}
