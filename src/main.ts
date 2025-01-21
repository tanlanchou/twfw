import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

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
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'application.log',
          maxsize: 200 * 1024 * 1024, // 200 MB
          maxFiles: 5, // Keep a maximum of 5 log files
          tailable: true, // Ensure the log files are rotated
          zippedArchive: true, // Compress the rotated files
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
    }),
  });

  await app.listen();
}
bootstrap();