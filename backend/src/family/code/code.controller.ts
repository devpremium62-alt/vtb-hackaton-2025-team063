import {Controller, Post, UseGuards} from '@nestjs/common';
import {CodeService} from "./code.service";
import {User} from "../../common/decorators/user.decorator";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller('family/code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    public async create(@User("id") userId: number) {
        const code = await this.codeService.makeCode(userId);
        return {code};
    }
}
