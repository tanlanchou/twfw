import {
  Controller,
  Get,
  Inject,
  Injectable,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { PhoneService } from "./phone.service";
import { ClientProxy } from "@nestjs/microservices";
import { sendSMSDto } from "src/common/dto/send.sms.dto";
import { SendSMSWithUserDto } from "src/common/dto/send.sms.with.user.dto";
import { IPIntervalService } from 'src/common/ipInterval/ip.interval.service';
import { result, error } from 'src/common/helper/result'
import * as _ from 'lodash'

@Controller("sms")
@Injectable()
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    @Inject("MICROSERVICE_LOG_CLIENT") private readonly client: ClientProxy,
    private readonly ipIntervalService: IPIntervalService,
  ) { }

  @MessagePattern({ cmd: "sendSMS" })
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendSMS(data: SendSMSWithUserDto) {

    try {
      const ip = data.user.ip;

      if (_.isEmpty(ip)) {
        return error(`未知IP`);
      }

      const isEable = await this.ipIntervalService.IsEnable(ip);
      if (!isEable) {
        return error("间隔时间未到，不允许发送");
      }

      await this.phoneService.createDysmsapiClient();
      return this.phoneService.sendMessageWithTemplate(data);
    }
    catch (ex) {
      return error(ex.message);
    }
  }
}
