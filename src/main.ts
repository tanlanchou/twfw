import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';

async function bootstrap() {
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