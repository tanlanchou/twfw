// src/jwt/jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { JwtController } from './jwt.controller';
import { ConfigService } from '../config/config.service';

@Module({
    imports: [
        NestJwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
                const jwtConfig = await configService.get('jwt');
                return {
                    secret: jwtConfig.secret,
                    signOptions: { expiresIn: jwtConfig.expiresIn },
                };
            },
            inject: [ConfigService],
        })
    ],
    providers: [JwtService],
    controllers: [JwtController],
    exports: [JwtService],
})
export class JwtModule { }