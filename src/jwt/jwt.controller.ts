// src/jwt/jwt.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JwtService } from './jwt.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { error, result, success } from 'src/common/helper/result';

@Controller()
export class JwtController {
  constructor(private readonly jwtService: JwtService) { }

  @MessagePattern({ cmd: 'createToken' })
  async createToken(payload: JwtPayload): Promise<result> {
    try {
      const r = await this.jwtService.createToken(payload);
      return success(r);
    }
    catch (ex) {
      console.error(ex);
      return error(ex.message);
    }
  }

  @MessagePattern({ cmd: 'verifyToken' })
  async verifyToken(data: any): Promise<result> {
    try {
      return success(await this.jwtService.verifyToken(data.token));
    }
    catch (ex) {
      console.error(ex);
      return error(ex.message);
    }
  }

  @MessagePattern({ cmd: 'refreshToken' })
  async refreshToken(data: any): Promise<result> {
    try {
      return success(await this.jwtService.refreshToken(data.token));
    }
    catch (ex) {
      console.error(ex);
      return error(ex.message);
    }
  }
}