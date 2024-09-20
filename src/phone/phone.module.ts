//src/phone/phone.module.ts
import { Module } from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { PhoneController } from "./phone.controller";
import { ConfigService } from "../common/config/config.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import listen_microservice from "src/common/helper/listenMicroservice";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "MICROSERVICE_LOG_CLIENT",
        useFactory: listen_microservice("micLog"),
        inject: [ConfigService],
      },
      // {
      //   name: "MICROSERVICE_JWT_CLIENT",
      //   useFactory: listen_microservice("micJwt"),
      //   inject: [ConfigService],
      // },
    ]),
  ],
  providers: [PhoneService],
  controllers: [PhoneController],
  exports: [PhoneService],
})
export class PhoneModule { }
