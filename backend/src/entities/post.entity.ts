import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Time } from './time.entity';
import { Users } from './user.entity';
import { Hashtags } from './hashtags.entity';

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
    medias: string[];

    @Column()
    userId: string;

    @ManyToOne(() => Users, (user) => user.posts)
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
}
