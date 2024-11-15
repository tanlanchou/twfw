import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('LogList')
export class LogList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskId: number;

    @Column('text')
    content: string;

    @Column({ default: false })
    isDuplicate: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    scanTime: Date;
}