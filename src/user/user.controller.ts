import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

    @Get()
    register(): string {
      //注册短信或者邮件的微服务
      //验证信息, 写一个dto
      //验证码的微服务
    }
}
