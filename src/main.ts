import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from "src/common/config/config.service";
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {

  process.env.CONFIG_NAME = "verification_code";
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

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const errorMessages = errors.map(error => {
        const constraints = Object.values(error.constraints);
        return {
          field: error.property,
          errors: constraints,
        };
      });

      console.log(errorMessages); // 记录详细的验证错误信息
      return new BadRequestException(errorMessages);
    }
  }));

  await app.listen();
}
bootstrap();
