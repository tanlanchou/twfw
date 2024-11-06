import { Module, Global } from '@nestjs/common';
import { ConfigService } from "src/common/config/config.service";
import { ClientsModule, Transport } from '@nestjs/microservices';
import listen_microservice from 'src/common/helper/listenMicroservice';

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'MICROSERVICE_JWT_CLIENT',
                useFactory: listen_microservice("micJwt"),
                inject: [ConfigService],
            }
        ]),
    ],
    exports: [ClientsModule],
})
export class GlobalJwtClientsModule { }
