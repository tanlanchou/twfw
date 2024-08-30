import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';

async function bootstrap() {

  process.env.CONFIG_NAME = "log";
  process.env.VERSION = "v0.1.0";
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "pro";
  }

  const configService = new ConfigService();
  const config = await configService.get('log');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: config.microservice.host,
      port: config.microservice.port,
    },
  });

  await app.listen();
}
bootstrap();