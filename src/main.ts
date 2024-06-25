import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
async function bootstrap() {
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
