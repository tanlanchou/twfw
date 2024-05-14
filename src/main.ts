import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConsulService } from './consul.service';

async function bootstrap() {
  const consulService = new ConsulService();
  const config = await consulService.getConfig('log');

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