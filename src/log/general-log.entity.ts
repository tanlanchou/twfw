import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('general_log')
export class GeneralLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    operation: string;

    @Column()
    operator: string;

    @Column()
    platform: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @Column('text')
    details: string;

    @Column()
    status: string;

    @Column()
    related_id: number;
}