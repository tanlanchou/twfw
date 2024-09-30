import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from './common/config/config.service';
async function bootstrap() {

  process.env.CONFIG_NAME = "email";
  process.env.VERSION = "v0.1.0";
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "pro";
  }

  const configService = new ConfigService();
  const emailOptions = await configService.get('email');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: emailOptions.microservice.host,
      port: emailOptions.microservice.port,
    },
  });
  await app.listen();
}
bootstrap();