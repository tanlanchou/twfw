import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { UserStatus } from '../enum/userStatus';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn({ comment: '用户唯一标识符' })
    id: number;

    @Column({ name: 'username', type: 'varchar', length: 50, nullable: false, comment: '用户名' })
    username: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: false, comment: '密码' })
    password: string;

    @Column({ name: 'platform', type: 'varchar', length: 50, nullable: true, comment: '平台' })
    platform: string;

    @Column({ name: 'last_login_time', type: 'datetime', nullable: true, comment: '最后登录时间' })
    lastLoginTime: Date;

    @Column({ name: 'ip', type: 'varchar', length: 45, nullable: true, comment: 'IP地址' })
    ip: string;

    @CreateDateColumn({ name: 'registration_time', type: 'datetime', nullable: false, comment: '注册时间' })
    registrationTime: Date;

    @Column({
        name: 'status',
        type: 'enum',
        enum: UserStatus,
        default: 'active',
        comment: '状态',
    })
    status: UserStatus;

    @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true, comment: '头像URL' })
    avatarUrl: string;

    @Column({ name: 'language_preference', type: 'varchar', length: 10, nullable: true, comment: '语言偏好' })
    languagePreference: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true, comment: '手机号码' })
    phoneNumber: string;

    @Column({ name: 'email', type: 'varchar', length: 100, nullable: false, unique: true, comment: '电子邮件地址' })
    email: string;

    @Column({ name: 'salt', type: 'varchar', length: 100, nullable: true, unique: false, comment: 'salt' })
    salt: string;
}