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

@Controller("sms")
@Injectable()
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    @Inject("MICROSERVICE_LOG_CLIENT") private readonly client: ClientProxy
  ) { }

  @MessagePattern({ cmd: "sendSMS" })
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendSMS(data: SendSMSWithUserDto) {
    await this.phoneService.createDysmsapiClient();
    this.phoneService.sendMessageWithTemplate(data);
  }
}
