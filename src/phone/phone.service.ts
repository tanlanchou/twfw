import { Controller, Inject, Injectable, Logger } from "@nestjs/common";
import Dysmsapi20170525, * as $Dysmsapi20170525 from "@alicloud/dysmsapi20170525";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";
import { ConfigService } from "../common/config/config.service";
import { sendSMSDto } from "src/common/dto/send.sms.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class PhoneService {
  constructor(private readonly configService: ConfigService, @Inject('MICROSERVICE_LOG_CLIENT') private readonly clientLog: ClientProxy) { }
  private client: Dysmsapi20170525 = null;
  async createDysmsapiClient() {
    if (this.client === null) {
      const phoneOptions = await this.configService.get(process.env.CONFIG_NAME);
      const conf = phoneOptions.config;
      const config = new $OpenApi.Config({
        accessKeyId: conf.access_key_id,
        accessKeySecret: conf.access_key_secret,
      });
      config.endpoint = conf.endpoint;
      this.client = new Dysmsapi20170525(config);
    }
  }

  async sendMessageWithTemplate(
    data: sendSMSDto
  ) {
    try {
      const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
        phoneNumbers: data.to,
        signName: data.signName,
        templateCode: data.templateCode,
        templateParam: data.templateParam,
      });

      const runtime = new $Util.RuntimeOptions({});
      const result = await this.client.sendSmsWithOptions(sendSmsRequest, runtime);
      console.log(result);
    }
    catch (ex) {
      await firstValueFrom(
        this.clientLog.send<object>(
          { cmd: 'addLog' },
          {
            operation: 'SEND_EMAIL',
            operator: data.user.name,
            platform: data.user.platform,
            details: `
          这封邮件是由${data.user.name}发出的, 
          标题是${data.data.subject}, 
          内容是${data.data.text}, 
          发送给${data.data.to},
          IP:${data.user.ip || NetworkUtils.getLocalIpAddress()}`,
            status: result ? 'success' : 'failure',
          },
        ),
      );
      return false;
    }
  }
}
