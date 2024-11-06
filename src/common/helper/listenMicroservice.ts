import { Transport, ClientProvider } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';


const listen_microservice = function (name: string, configName?: string) {
    return async (configService: ConfigService): Promise<ClientProvider> => {
        const config = await configService.get(configName || process.env.CONFIG_NAME);
        const services = await configService.findService(config[name]);
        if (!(services instanceof Array) || services.length == 0) {
            console.error("没有找到在线的service");
            return null;
        }

        const service = services[0];
        return {
            transport: Transport.TCP,
            options: {
                host: service.ServiceAddress,
                port: service.ServicePort,
            },
        }
    }
}

export default listen_microservice;