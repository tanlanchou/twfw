import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from './common/config/config.service';

async function bootstrap() {

  process.env.CONFIG_NAME = "phone";
  process.env.VERSION = "v0.1.0";
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "pro";
  }

  const configService = new ConfigService();
  const phoneOptions = await configService.get(process.env.CONFIG_NAME);
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: phoneOptions.microservice.host,
      port: phoneOptions.microservice.port,
    },
  });
  await app.listen();
}
bootstrap();


