import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Time {
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
