import { Injectable, Logger } from "@nestjs/common";
import Dysmsapi20170525, * as $Dysmsapi20170525 from "@alicloud/dysmsapi20170525";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";
import { ConfigService } from "../config/config.service";

@Injectable()
export class PhoneService {
  constructor(private readonly configService: ConfigService) {}
  private client: Dysmsapi20170525 = null;
  async createDysmsapiClient() {
    if (this.client === null) {
      const phoneOptions = await this.configService.get("phone");
      const conf = phoneOptions.config;
      const config = new $OpenApi.Config({
        accessKeyId: conf.ACCESS_KEY_ID,
        accessKeySecret: conf.ACCESS_KEY_SECRET,
      });
      config.endpoint = conf.ENDPOINT;
      this.client = new Dysmsapi20170525(config);
    }
  }

  async sendMessageWithTemplate(
    to: string,
    signName: string,
    templateCode: string,
    templateParam: string
  ) {
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: to,
      signName: signName,
      templateCode: templateCode,
      templateParam: templateParam,
    });

    const runtime = new $Util.RuntimeOptions({});
    await this.client.sendSmsWithOptions(sendSmsRequest, runtime);
  }
}
