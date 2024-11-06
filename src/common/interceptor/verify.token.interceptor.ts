import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { success, error, result } from 'src/common/helper/result'
import * as _ from "lodash"
import { UserService } from 'src/user/user.service';
import { Request } from "express"

@Injectable()
export class VerifyTokenInterceptor implements NestInterceptor {
  constructor(
    @Inject('MICROSERVICE_JWT_CLIENT') private readonly clientJwt: ClientProxy,
    private readonly userService: UserService,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('未提供令牌');
    }

    try {
      const result = await firstValueFrom(
        this.clientJwt.send<result>({ cmd: 'verifyToken' }, { token })
      );

      if (result.code !== 200) {
        throw new UnauthorizedException(result.msg || '令牌无效');
      }

      // 检查 token 的剩余有效期，如果快过期则刷新 token
      const expirationThreshold = 5 * 60; // 阈值为 5 分钟（单位：秒）
      const timeRemaining = result.data.expiration - Math.floor(Date.now() / 1000);

      if (timeRemaining < expirationThreshold) {
        // 请求一个新 token 并将其添加到响应中
        const newTokenResult = await firstValueFrom(
          this.clientJwt.send<result>({ cmd: 'refreshToken' }, { token })
        );
        if (newTokenResult.code !== 200) {
          Logger.error(`更换Token出错,${JSON.stringify(newTokenResult)}`);
        }
        else {
          request.newToken = newTokenResult.data;
        }
      }

      if (!_.has(request, 'user')) {
        const tokenArr = _.split(_.get(result, "data.userId", ""), "-")
        if (tokenArr.length !== 4) {
          throw new UnauthorizedException("token格式不正确，请清除缓存后重试");
        }

        const id = _.toNumber(tokenArr[3]);
        const user = await this.userService.findUserById(id);
        if (_.isEmpty(user)) {
          throw new UnauthorizedException("用户不存在，请清除缓存后重试");
        }

        const userWithoutPassword = _.omit(user, ['password'])
        request.user = userWithoutPassword
      }

      return next.handle().pipe(
        map((data) => {
          // 如果有新 token，则将其添加到响应头中
          if (request.newToken) {
            context.switchToHttp().getResponse().setHeader('x-new-token', request.newToken);
          }
          return {
            message: '请求成功',
            data: request.user,
          };
        })
      );
    } catch (error) {
      throw new UnauthorizedException('令牌验证失败');
    }
  }
}
