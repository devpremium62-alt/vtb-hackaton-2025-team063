import {Inject, Injectable} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class CodeService {
    public constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
    }

    public async makeCode(userId: number) {
        const code = this.generateCode();
        await this.redis.set(`family:code:${code}`, userId.toString(), "EX", 86400);

        return code;
    }

    public async getUserFromCode(code: string) {
        const userId = await this.redis.get(`family:code:${code}`);
        if(userId) {
            return Number(userId);
        }

        return null;
    }

    private generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
