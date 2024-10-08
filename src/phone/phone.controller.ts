import {
  Controller,
  Get,
  Inject,
  Injectable,
  Logger,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { PhoneService } from "./phone.service";
import { ClientProxy } from "@nestjs/microservices";
import { sendSMSDto } from "src/common/dto/send.sms.dto";
import { SendSMSWithUserDto } from "src/common/dto/send.sms.with.user.dto";
import { IPIntervalService } from "src/common/ipInterval/ip.interval.service";
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { error, success } from "src/common/helper/result";
import { Action } from "src/common/enum/action";
import { NetworkUtils } from "src/common/helper/ip";

@Controller("sms")
@Injectable()
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    private readonly iPIntervalService: IPIntervalService,
    @Inject("MICROSERVICE_LOG_CLIENT") private readonly client: ClientProxy
  ) { }

  @MessagePattern({ cmd: "sendSMS" })
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendSMS(data: SendSMSWithUserDto) {

    try {
      const ip = _.get(data, 'user.ip');
      if (_.isEmpty(ip)) {
        return error("用户IP不能为空");
      }

      const ipResult = await this.iPIntervalService.IsEnable(ip);
      if (!ipResult) {
        return error("请求频率过快");
      }

      await this.iPIntervalService.set(ip);
      await this.phoneService.createDysmsapiClient();
      return this.phoneService.sendMessageWithTemplate(data);
    }
    catch (ex) {
      await firstValueFrom(
        this.client.send<object>(
          { cmd: 'addLog' },
          {
            operation: Action.SEND_SMS,
            operator: data.user.name,
            platform: data.user.platform,
            details: `
        短信是由 ${data.user.name} 发出的, 
        templateCode是 ${data.data.templateCode}, 
        signName是 ${data.data.signName}, 
        templateParam是 ${data.data.templateParam}
        发送给${data.data.to},
        IP:${data.user.ip || NetworkUtils.getLocalIpAddress()},
        结果: 发送错误, 错误信息${ex.message}`
          },
        ),
      );
      return error(ex.message);
    }
  }
}
