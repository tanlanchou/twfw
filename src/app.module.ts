// src/app.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from './common/config/config.module'; // Import the ConfigModule

@Module({
  imports: [
    ConfigModule, // Add ConfigModule to the imports array
    JwtModule,
  ],
})
export class AppModule {}