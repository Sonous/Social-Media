import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Rooms } from './room.entity';
import { Users } from './user.entity';

@Entity()
export class RoomsUsers {
    @PrimaryColumn()
    room_id: string;

    @PrimaryColumn()
    user_id: string;

    @ManyToOne(() => Rooms, (room) => room)
    @JoinColumn({ name: 'room_id' })
    room: Rooms;

    @ManyToOne(() => Users, (user) => user)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}
