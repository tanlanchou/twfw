import * as Consul from 'consul';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private consul: Consul.Consul;
  private cache: Map<string, any>;
  private cacheTTL: number; // 缓存的有效期（毫秒）
  private cacheTimestamps: Map<string, number>; // 缓存的时间戳

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST, // Consul 服务器地址
      port: 8500, // Consul 服务器端口
      promisify: true,
    });
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 设置缓存有效期为5分钟
    this.cacheTimestamps = new Map();
  }

  async get(key: string): Promise<any> {
    const now = Date.now();
    const cachedValue = this.cache.get(key);
    const cachedTimestamp = this.cacheTimestamps.get(key);

    if (cachedValue && cachedTimestamp && (now - cachedTimestamp < this.cacheTTL)) {
      return cachedValue;
    }

    const result = await this.consul.kv.get(key);
    if (result && result.Value) {
      const value = JSON.parse(result.Value.toString('utf8'));
      this.cache.set(key, value);
      this.cacheTimestamps.set(key, now);
      return value;
    }
    return null;
  }
}
