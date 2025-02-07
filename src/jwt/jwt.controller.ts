// src/jwt/jwt.controller.ts
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { JwtService } from './jwt.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { error, result, success } from 'src/common/helper/result';
import { Action } from 'src/common/enum/action';
import { NetworkUtils } from 'src/common/helper/ip';
import { AccessVerifyInterceptor } from 'src/common/interceptor/access.verify.interceptor';
import { LogMethods } from 'src/common/enum/methods';
import { GetJwtDTO, RefreshJwtDTO, VerifyJwtDTO } from 'src/common/dto/jwt.dto';

@Controller()
export class JwtController {
  constructor(private readonly jwtService: JwtService, @Inject("MICROSERVICE_LOG_CLIENT") private readonly client: ClientProxy) { }

  @MessagePattern({ cmd: LogMethods.JWT_CREATE_TOKEN })
  @UseInterceptors(AccessVerifyInterceptor)
  async createToken(payload: GetJwtDTO): Promise<result> {
    try {
      const r = await this.jwtService.createToken(payload);
      return success(r);
    }
    catch (ex) {
      console.error(ex);
      this.client.send<object>(
        { cmd: LogMethods.LOG_ADD },
        {
          operation: Action.CREATE_TOKEN,
          operator: "ttwatch",
          platform: "ttwatch",
          details: `获取创建TOKEN失败, 错误信息${ex.message}, ${NetworkUtils.getLocalIpAddress()}`
        },
      )
      return error(ex.message);
    }
  }

  @MessagePattern({ cmd: LogMethods.JWT_VERIFY_TOKEN })
  @UseInterceptors(AccessVerifyInterceptor)
  async verifyToken(data: VerifyJwtDTO): Promise<result> {
    try {
      return success(await this.jwtService.verifyToken(data.token));
    }
    catch (ex) {
      console.error(ex);
      this.client.send<object>(
        { cmd: LogMethods.LOG_ADD },
        {
          operation: Action.VERIFY_TOKEN,
          operator: "ttwatch",
          platform: "ttwatch",
          details: `获取验证TOKEN失败, 错误信息${ex.message}, ${NetworkUtils.getLocalIpAddress()}`
        },
      )
      return error(ex.message);
    }
  }

  @MessagePattern({ cmd: LogMethods.JWT_REFRESH_TOKEN })
  @UseInterceptors(AccessVerifyInterceptor)
  async refreshToken(data: RefreshJwtDTO): Promise<result> {
    try {
      return success(await this.jwtService.refreshToken(data.token));
    }
    catch (ex) {
      console.error(ex);
      this.client.send<object>(
        { cmd: LogMethods.LOG_ADD },
        {
          operation: Action.REFRESH_TOKEN,
          operator: "ttwatch",
          platform: "ttwatch",
          details: `获取刷新TOKEN失败, 错误信息${ex.message}, ${NetworkUtils.getLocalIpAddress()}`
        },
      )
      return error(ex.message);
    }
  }
}