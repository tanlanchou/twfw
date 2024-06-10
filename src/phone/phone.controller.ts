import {
  Controller,
  Inject,
  Injectable,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { PhoneService } from "./phone.service";
import { ClientProxy } from "@nestjs/microservices";

@Controller()
@Injectable()
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    @Inject("MICROSERVICE_LOG_CLIENT") private readonly client: ClientProxy
  ) {}

  @MessagePattern({ cmd: "sendSMS" })
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendSMS(
    to: string,
    signName: string,
    templateCode: string,
    templateParam: string
  ) {
    await this.phoneService.createDysmsapiClient();
    this.phoneService.sendMessageWithTemplate(
      to,
      signName,
      templateCode,
      templateParam
    );
  }
}
