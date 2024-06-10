import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
async function bootstrap() {
  const configService = new ConfigService();
  const phoneOptions = await configService.get('phone');
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
