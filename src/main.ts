import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.CONFIG_NAME = 'test';
  process.env.VERSION = 'v0.1.0';
  const app = await NestFactory.create(AppModule);
  await app.listen(8100);
}
bootstrap();