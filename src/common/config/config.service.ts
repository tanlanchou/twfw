import * as Consul from 'consul';
import { Injectable, Logger } from '@nestjs/common';
import { NetworkUtils } from "../helper/ip";
import * as _ from "lodash";

@Injectable()
export class ConfigService {
  private consul: Consul.Consul;
  private cache: Map<string, any>;
  private cacheTTL: number; // 缓存的有效期（毫秒）
  private cacheTimestamps: Map<string, number>; // 缓存的时间戳
  private logger = new Logger(ConfigService.name);

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST, // Consul 服务器地址
      port: "8500", // Consul 服务器端口
      promisify: true,
    });
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 设置缓存有效期为5分钟
    this.cacheTimestamps = new Map();
  }

  async onModuleInit() {
    await this.registerService();
  }

  async registerService() {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : "pro";
    const configName = process.env.CONFIG_NAME;
    const version = process.env.VERSION;

    if (!configName) {
      Logger.error("找不到 CONFIG_NAME 环境变量")
      return;
    }

    const config = await this.get(configName);
    const serviceId = `${configName}_${version}_${env}`;
    const serviceName = `${configName}_${version}_${env}`;
    const servicePort = env === 'dev' ? config.microservice.port : config.out.port;
    const serviceType = _.get(config, 'out.type', 'tcp');
    const address = env === 'dev' ? NetworkUtils.getLocalIpAddress() : config.out.host;


    let service: Consul.Agent.Service.RegisterOptions;

    switch (serviceType) {
      case "tcp":
        Logger.log("tcp")
        service = {
          id: serviceId,
          name: serviceName,
          address: address, // 服务地址
          port: servicePort,
          check: {
            tcp: `${address}:${servicePort}`, // 健康检查 URL
            interval: '60s',
            timeout: '10s',
          },
        };
        break;
      case "http":
        Logger.log("http")
        service = {
          id: serviceId,
          name: serviceName,
          address: address, // 服务地址
          port: servicePort,
          check: {
            http: `${address}/health`, // 健康检查 URL
            interval: '60s',
            timeout: '10s',
          },
        };
        break;
      default:
        throw new Error(`不支持的服务类型：${serviceType}`);
    }

    Logger.log(`register info`);
    Logger.log(JSON.stringify(service));


    try {
      await this.consul.agent.service.register(service);
      Logger.log(`Service ${serviceId} registered with Consul`);
    } catch (error) {
      Logger.error('Failed to register service with Consul', error);
    }
  }

  async findService(serviceName: string) {
    try {
      const services = await this.consul.catalog.service.nodes(serviceName);
      return services;
    } catch (error) {
      Logger.error(`Failed to find service ${serviceName}:`, error);
      throw error;
    }
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
