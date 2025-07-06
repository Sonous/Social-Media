import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Time } from './time.entity';
import { MediaType } from 'src/posts/post.interface';
import { Rooms } from './room.entity';
import { Users } from './user.entity';

@Entity()
export class Messages extends Time {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column('text', {
        transformer: {
            to(value) {
                return JSON.stringify(value);
            },
            from(value) {
                return JSON.parse(value);
            },
        },
    })
    medias: MediaType[];

    @Column({
        name: 'status',
        enum: ['sent', 'read', 'recovery'],
        default: 'sent',
        type: 'enum',
    })
    status: 'sent' | 'read' | 'recovery';

    @Column()
    user_id: string;

    @Column()
    room_id: string;

    @ManyToOne(() => Rooms, (room) => room.messages)
    @JoinColumn({ name: 'room_id' })
    room: Rooms;

    @ManyToOne(() => Users, (user) => user.messages)
    @JoinColumn({ name: 'user_id' })
    sender: Users;
}
