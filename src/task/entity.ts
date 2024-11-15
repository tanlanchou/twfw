import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('taskList')
export class TaskList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ length: 300 })
    feed: string;

    @Column({ default: 1 })
    type: number;

    @Column({ default: 0 })
    hasUpdate: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastFetchTime: Date;

    @Column({ type: 'enum', enum: ['normal', 'disabled'], default: 'normal' })
    status: 'normal' | 'disabled';

    @Column({ type: 'enum', enum: ['not_started', 'success', 'failure'], default: 'not_started' })
    smsNotificationStatus: 'not_started' | 'success' | 'failure';

    @Column({ type: 'enum', enum: ['not_started', 'success', 'failure'], default: 'not_started' })
    emailNotificationStatus: 'not_started' | 'success' | 'failure';

    @Column({ type: 'enum', enum: ['not_started', 'success', 'failure'], default: 'not_started' })
    pushNotificationStatus: 'not_started' | 'success' | 'failure';

    @Column({ type: 'enum', enum: ['normal', 'failure'], default: 'normal' })
    feedStatus: 'normal' | 'failure';
}