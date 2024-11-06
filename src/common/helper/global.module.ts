import { Module, Global } from '@nestjs/common';
import { GlobalService } from './global.service'

@Global()
@Module({
    providers: [GlobalService],  // 将 GlobalService 放在 providers 数组中
    exports: [GlobalService]
})
export class GlobalModule { }


