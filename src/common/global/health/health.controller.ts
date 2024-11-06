import {
    Controller,
    Get,
    Injectable,
} from "@nestjs/common";


@Controller("")
@Injectable()
export class HealthController {
    @Get("health")
    checkHealth() {
        return {
            status: 'healthy',
        };
    }
}