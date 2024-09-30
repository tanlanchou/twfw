import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from './common/config/config.service';

const configName = "user";
const version = "v0.1.0";

async function bootstrap() {

  process.env.CONFIG_NAME = configName;
  process.env.VERSION = version;
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "pro";
  }

  const configService = new ConfigService();
  const options = await configService.get(configName);
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: options.microservice.host,
      port: options.microservice.port,
    },
  });
  await app.listen();
}
bootstrap();