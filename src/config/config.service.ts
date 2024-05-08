import * as Consul from 'consul';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private consul: Consul.Consul;

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST, // Consul 服务器地址
      port: 8500, // Consul 服务器端口
      promisify: true,
    });
  }

  async get(key: string): Promise<any> {
    const result = await this.consul.kv.get(key);
    if (result && result.Value) {
      return JSON.parse(result.Value.toString('utf8'));
    }
    return null;
  }
}