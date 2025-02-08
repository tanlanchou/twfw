//src/phone/phone.module.ts
import { Module } from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { PhoneController } from "./phone.controller";
import { ConfigService } from "src/common/config/config.service";
import { ConfigModule } from "src/common/config/config.module";

@Module({
  providers: [PhoneService],
  controllers: [PhoneController],
  exports: [PhoneService],
})
export class PhoneModule { }
