import { Controller, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "src/common/config/config.service";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCodeEntity } from './verification.entity';
import { UserDto } from "src/common/dto/user.dto";
import { LessThanOrEqual } from 'typeorm';
import { GlobalService } from 'src/common/helper/global.service'

@Injectable()
export class VService {
    constructor(private readonly configService: ConfigService, @InjectRepository(VerificationCodeEntity)
    private readonly VerificationCodeRepository: Repository<VerificationCodeEntity>, private readonly globalService: GlobalService) { }

    private generateVerificationCode(): string {
        const digits = '0123456789';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const allCharacters = digits;

        let code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * allCharacters.length);
            code += allCharacters[randomIndex];
        }

        return code;
    }


    async buildCode(user: UserDto) {
        //生成6位验证码
        const code = this.generateVerificationCode();
        await this.VerificationCodeRepository.save({
            userId: user.id,
            platform: user.platform,
            code: code,
            created_at: new Date()
        });

        return code;
    }

    async deleteExpireCode() {
        const twoHoursAgo = new Date(Date.now() - this.globalService.getGlobalData().maxVerificationCode);

        this.VerificationCodeRepository.delete({
            created_at: LessThanOrEqual(twoHoursAgo)
        });
    }

    async deleteVerificationCode(user: UserDto) {
        await this.VerificationCodeRepository.delete(({
            userId: user.id,
            platform: user.platform
        }))
    }

    async verify(code: string, user: UserDto): Promise<boolean> {
        const verificationCode = await this.VerificationCodeRepository.findOne({
            where: {
                userId: user.id,
                platform: user.platform,
                code: code,
                created_at: LessThanOrEqual(new Date(Date.now() - this.globalService.getGlobalData().maxVerificationCode))
            }
        });
        if (verificationCode) {
            this.deleteVerificationCode(user);
            return true;
        } else {
            return false;   // 验证失败
        }
    }
}
