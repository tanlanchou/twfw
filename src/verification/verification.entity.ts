import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'verification_code' })
export class VerificationCodeEntity {
    @PrimaryColumn({ type: 'char', length: 32 })
    userId: string;

    @Column({ type: 'char', length: 6 })
    code: string;

    @Column({ type: 'datetime' })
    created_at: Date;

    @Column({ type: 'char', length: 100 })
    platform: string;
}