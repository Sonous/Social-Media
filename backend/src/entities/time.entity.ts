import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Time {
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
