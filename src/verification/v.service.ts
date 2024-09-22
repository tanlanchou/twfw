import { Controller, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCodeEntity } from './verification.entity';
import { UserDto } from "src/common/dto/user.dto";

@Injectable()
export class VService {
    constructor(private readonly configService: ConfigService, @InjectRepository(VerificationCodeEntity)
    private readonly VerificationCodeRepository: Repository<VerificationCodeEntity>) { }

    private generateVerificationCode(): string {
        const digits = '0123456789';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const allCharacters = digits + letters;

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
            createAt: new Date()
        });

        return code;
    }

    async verify(code: string, user: UserDto): Promise<boolean> {
        const verificationCode = await this.VerificationCodeRepository.findOne({
            where: { userId: user.id, platform: user.platform, code: code }
        });
        if (verificationCode) {
            await this.VerificationCodeRepository;
            return true;
        } else {
            return false;   // 验证失败
        }
    }
}
