// src/jwt/jwt.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JwtService } from './jwt.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller()
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

  @MessagePattern({ cmd: 'createToken' })
  async createToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.createToken(payload);
  }

  @MessagePattern({ cmd: 'verifyToken' })
  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyToken(token);
  }

  @MessagePattern({ cmd: 'refreshToken' })
  async refreshToken(token: string): Promise<string> {
    return this.jwtService.refreshToken(token);
  }
}