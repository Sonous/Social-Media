import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Time } from './time.entity';
import { Messages } from './message.entity';
import { RoomsUsers } from './roomsUsers.entity';

@Entity()
export class Rooms extends Time {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    avatar_url: string;

    @Column({
        enum: ['group', 'private'],
    })
    type: 'group' | 'private';

    @OneToMany(() => Messages, (message) => message.room)
    messages: Messages[];

    @OneToMany(() => RoomsUsers, (roomUser) => roomUser.room)
    roomUsers: RoomsUsers[];
}
