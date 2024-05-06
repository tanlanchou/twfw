// src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
async function bootstrap() {

  const configService = new ConfigService();
  const jwtOptions = await configService.get('jwt');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: jwtOptions.microservice.host,
      port: jwtOptions.microservice.port,
    },
  });
  await app.listen();
}
bootstrap();