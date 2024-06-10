//src/phone/phone.module.ts
import { Module } from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { PhoneController } from "./phone.controller";
import { ConfigService } from "../config/config.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "MICROSERVICE_LOG_CLIENT",
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: (await configService.get("phone")).log.host,
            port: (await configService.get("phone")).log.port,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [PhoneService],
  controllers: [PhoneController],
  exports: [PhoneService],
})
export class PhoneModule {}
