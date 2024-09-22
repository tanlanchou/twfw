import { Controller, Inject, Injectable, Logger } from "@nestjs/common";
import Dysmsapi20170525, * as $Dysmsapi20170525 from "@alicloud/dysmsapi20170525";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";
import { ConfigService } from "../common/config/config.service";
import { sendSMSDto } from "src/common/dto/send.sms.dto";
import { ClientProxy } from "@nestjs/microservices";
import { SendSMSWithUserDto } from "src/common/dto/send.sms.with.user.dto";
import { firstValueFrom } from 'rxjs';
import { NetworkUtils } from "src/common/helper/ip";
import { ErrorCode, getErrorMessageByCode } from "./apiErrorCode";
import { result, success, error } from "src/common/helper/result";
import { Action } from "src/common/enum/action";

@Injectable()
export class PhoneService {
  constructor(private readonly configService: ConfigService, @Inject('MICROSERVICE_LOG_CLIENT') private readonly clientLog: ClientProxy) { }
  private client: Dysmsapi20170525 = null;
  /**
   * 异步创建DysmsapiClient实例
   * 此方法仅在客户端对象为null时创建一个新的DysmsapiClient对象
   * 它首先从配置服务中获取配置信息，然后使用这些配置信息来创建一个新的阿里云OpenAPI配置对象，
   * 最后使用此配置创建DysmsapiClient实例
   * 
   * @remarks 此方法是异步的，因为它使用了await来等待配置信息的获取
   * 
   * @returns {void} 此方法没有返回值，但它初始化了类中的client属性
   */
  async createDysmsapiClient() {
    // 检查client是否为null，如果为null，则需要创建一个新的DysmsapiClient实例
    if (this.client === null) {
      // 从环境变量中获取配置信息的名称，然后通过配置服务获取实际的配置信息
      const phoneOptions = await this.configService.get(process.env.CONFIG_NAME);
      const conf = phoneOptions.config;
      // 使用获取的配置信息创建一个新的阿里云OpenAPI配置对象
      const config = new $OpenApi.Config({
        accessKeyId: conf.access_key_id,
        accessKeySecret: conf.access_key_secret,
      });
      // 设置OpenAPI配置对象的endpoint
      config.endpoint = conf.endpoint;
      // 使用上述配置创建一个新的DysmsapiClient实例，并将其赋值给类中的client属性
      this.client = new Dysmsapi20170525(config);
    }
  }

  /**
   * 异步发送短信模板消息
   * @param data 包含发送短信所需数据的DTO，其中包括用户信息和短信数据
   * @returns 返回一个Promise，解析为布尔值，指示短信发送是否成功
   * 
   * 此函数使用阿里云短信服务API发送短信模板消息它准备发送请求，
   * 设置必要的参数如目标电话号码、签名名称、模板代码和模板参数然后，
   * 它使用客户端的sendSmsWithOptions方法发送请求，并根据HTTP状态码判断发送是否成功
   * 如果发送失败，它会记录相关的错误信息
   */
  async sendMessageWithTemplate(
    data: SendSMSWithUserDto
  ): Promise<result> {
    let booleanReuslt;
    let errorMessage;
    try {
      // 初始化发送短信的请求对象，设置必要的参数
      const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
        phoneNumbers: data.data.to,
        signName: data.data.signName,
        templateCode: data.data.templateCode,
        templateParam: data.data.templateParam,
      });

      // 创建运行时选项对象，用于配置请求的运行时行为
      const runtime = new $Util.RuntimeOptions({});
      // 发送短信请求，并等待结果
      const result = await this.client.sendSmsWithOptions(sendSmsRequest, runtime);

      if (result.body.code === 'OK') {
        booleanReuslt = true;
      }
      else {
        errorMessage = getErrorMessageByCode(result.body.code as ErrorCode);
        booleanReuslt = false;
      }

      return success(booleanReuslt);
    }
    catch (ex) {
      // 在发生异常时记录错误信息
      console.error(ex);
      errorMessage = ex.message;
      booleanReuslt = false;

      return error(errorMessage);
    }
    finally {
      await firstValueFrom(
        this.clientLog.send<object>(
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
        结果:${booleanReuslt ? "发送成功" : errorMessage}`,
            status: booleanReuslt ? 'success' : 'failure',
          },
        ),
      );
    }
  }
}
