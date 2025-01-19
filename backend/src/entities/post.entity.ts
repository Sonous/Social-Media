import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Time } from './time.entity';
import { Users } from './user.entity';

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

    @ManyToOne(() => Users, (user) => user.posts)
    user: Users;
}
