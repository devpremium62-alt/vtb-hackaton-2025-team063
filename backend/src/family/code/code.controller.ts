import {Controller, Post, UseGuards} from '@nestjs/common';
import {CodeService} from "./code.service";
import {User} from "../../common/decorators/user.decorator";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Код-приглашение")
@Controller('family/code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @ApiOperation({ summary: 'Получение кода для приглашения пользователя' })
    @ApiResponse({ status: 200, description: 'Данные с кодом' })
    @ApiCookieAuth('access_token')
    @Post()
    @UseGuards(JwtAuthGuard)
    public async create(@User("id") userId: number) {
        const code = await this.codeService.makeCode(userId);
        return {code};
    }
}
