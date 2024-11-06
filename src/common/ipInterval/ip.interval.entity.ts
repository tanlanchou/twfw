import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'ip_interval', schema: 'common' })
export class IpInterval {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    ip: string;

    @Column({ type: 'datetime' })
    lasttime: Date;
}