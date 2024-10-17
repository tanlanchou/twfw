import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from "src/common/entity/user.entity"
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigService } from "src/common/config/config.service";
import { ClientsModule, Transport } from '@nestjs/microservices';
import listen_microservice from 'src/common/helper/listenMicroservice';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "MICROSERVICE_LOG_CLIENT",
                useFactory: listen_microservice("micLog"),
                inject: [ConfigService],
            },
            {
                name: "MICROSERVICE_VERIFICATION_CLIENT",
                useFactory: listen_microservice("micVerification"),
                inject: [ConfigService],
            },
            {
                name: "MICROSERVICE_MAIL_CLIENT",
                useFactory: listen_microservice("micMail"),
                inject: [ConfigService],
            },
            {
                name: "MICROSERVICE_SMS_CLIENT",
                useFactory: listen_microservice("micSms"),
                inject: [ConfigService],
            },
        ]),
        TypeOrmModule.forRootAsync({
            useFactory: async (consulService: ConfigService) => {
                const config = await consulService.get('verification_code');
                return {
                    type: config.config.DB_TYPE,
                    host: config.config.DB_HOST,
                    port: config.config.DB_PORT,
                    username: config.config.DB_USERNAME,
                    password: config.config.DB_PASSWORD,
                    database: config.config.DB_DATABASE,
                    entities: [UserEntity],
                    synchronize: false, // 根据你的需求设置，通常在开发环境中设置为 true
                };
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }