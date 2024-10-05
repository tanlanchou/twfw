//src/phone/phone.module.ts
import { Module } from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { PhoneController } from "./phone.controller";
import { ConfigService } from "../common/config/config.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import listen_microservice from "src/common/helper/listenMicroservice";
import { ConfigModule } from "@nestcloud/config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MICROSERVICE_LOG_CLIENT',
        imports: [ConfigModule],
        useFactory: listen_microservice('micLog'), // 调用 listen_microservice 函数
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [PhoneService],
  controllers: [PhoneController],
  exports: [PhoneService],
})
export class PhoneModule { }
