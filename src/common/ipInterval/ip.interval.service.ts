
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IpInterval } from './ip.interval.entity';
import * as _ from 'lodash';
import { ConfigService } from 'src/common/config/config.service'
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IPIntervalService {
    constructor(@InjectRepository(IpInterval) private readonly IpIntervalRepository: Repository<IpInterval>, private readonly configService: ConfigService) {

    }

    async get(ip: string) {
        if (_.isEmpty(ip)) {
            throw new Error("IP 不能为空");
        }

        const result = await this.IpIntervalRepository.findOne({
            where: {
                ip
            }
        })

        return result;
    }

    async set(ip: string) {

        if(_.isEmpty(ip)) {
            throw new Error("ip 格式错误")
        }

        const model = new IpInterval();
        model.ip = ip;
        model.lasttime = new Date();
        this.IpIntervalRepository.save(model);
    }

    async IsEnable(ip: string, interval?: number): Promise<boolean> {
        const config = await this.configService.get("common");
        const intervalNumber = interval || _.get(config, 'ip.interval', 60);

        const result = await this.get(ip);
        if (_.isEmpty(result)) {
            return true;
        }


        // 获取当前时间
        const currentTime = new Date().getTime();
        // 获取上次访问时间
        const lastTime = new Date(result.lasttime).getTime();
        // 计算时间差
        const timeDifference = currentTime - lastTime;
        // 判断是否超过间隔时间
        return timeDifference > intervalNumber * 1000;
    }
}