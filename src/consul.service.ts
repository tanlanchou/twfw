import { Injectable } from '@nestjs/common';
import * as Consul from 'consul';

@Injectable()
export class ConsulService {
  private readonly consul: Consul.Consul;

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST,
      port: 8500,
      promisify: true,
    });
  }

  async getConfig(key: string): Promise<any> {
    const result = await this.consul.kv.get(key);
    if (result && result.Value) {
      return JSON.parse(result.Value.toString('utf8'));
    }
    return null;
  }
}