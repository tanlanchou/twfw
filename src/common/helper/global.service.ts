import { Injectable } from '@nestjs/common';
import IGlobal from '../interface/IGlobal';
import { ConfigService } from "src/common/config/config.service";

@Injectable()
export class GlobalService {
  private globalData: IGlobal;

  constructor(private readonly configService: ConfigService) {


    this.globalData = {
      maxVerificationCode: 20
    };

    this.configService.get("verification_code").then(config => {
      const regConfig = config && config.codeConfig && config.codeConfig.maxTime
      if (!regConfig) {
        throw new Error("注册验证码配置不存在");
      }

      const maxVerificationCodeNumber = Number(regConfig.maxTime || "20");
      this.globalData = {
        maxVerificationCode: maxVerificationCodeNumber
      };
    })


    configService



  }

  setPartGlobalData(data: Partial<IGlobal>) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this.globalData[key] = data[key];
      }
    }
  }

  getGlobalData() {
    return this.globalData;
  }
}