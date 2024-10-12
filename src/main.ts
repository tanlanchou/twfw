import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';

const configName = "user";
const version = "v0.1.0";

async function bootstrap() {
  process.env.CONFIG_NAME = configName;
  process.env.VERSION = version;
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "pro";
  }

  const app = await NestFactory.create(AppModule);
  
  await app.listen(8107, () => {
    console.log(`Application is running on: http://localhost:8107`);
  });
}
bootstrap();