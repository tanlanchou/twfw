import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn({ comment: '用户唯一标识符' })
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: false, comment: '用户名' })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: '密码' })
    password: string;

    @Column({ type: 'varchar', length: 50, nullable: true, comment: '平台' })
    platform: string;

    @Column({ type: 'datetime', nullable: true, comment: '最后登录时间' })
    lastLoginTime: Date;

    @Column({ type: 'varchar', length: 45, nullable: true, comment: 'IP地址' })
    ip: string;

    @CreateDateColumn({ type: 'datetime', nullable: false, comment: '注册时间' })
    registrationTime: Date;

    @Column({
        type: 'enum',
        enum: ['active', 'disabled'],
        default: 'active',
        comment: '状态',
    })
    status: 'active' | 'disabled';

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '头像URL' })
    avatarUrl: string;

    @Column({ type: 'varchar', length: 10, nullable: true, comment: '语言偏好' })
    languagePreference: string;

    @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号码' })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true, comment: '电子邮件地址' })
    email: string;
}