import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Time } from './time.entity';
import { Users } from './user.entity';

@Entity({
    name: 'notifications',
})
export class Notification extends Time {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({
        type: 'enum',
        enum: ['follow', 'like', 'comment', 'post'], // các loại thông báo có thể
        nullable: false,
    })
    type: string; // ví dụ: 'follow', 'like', 'comment'

    @ManyToOne(() => Users)
    @JoinColumn({
        name: 'sender_id',
    })
    sender: Users;

    // Thông tin phụ (id post, id comment, v.v.)
    @Column({ type: 'jsonb', nullable: true })
    meta: Record<string, any>;
}
