import {Body, Controller, Delete, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {ConsentsService} from "./consents.service";
import {CreateConsentDto} from "./consent.dto";
import {User} from "../../common/decorators/user.decorator";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Разрешения банков")
@Controller('consents')
export class ConsentsController {
    public constructor(private consentsService: ConsentsService) {
    }

    @ApiOperation({ summary: 'Создание согласия для банка' })
    @ApiResponse({ status: 201, description: 'Данные с согласием' })
    @ApiCookieAuth('access_token')
    @Post("/:bankId")
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    public async create(@Param("bankId") bankId: string, @User('id') userId: number, @Body() createConsentDto: CreateConsentDto) {
        return this.consentsService.createConsent(bankId, userId, createConsentDto);
    }

    @ApiOperation({ summary: 'Удаление согласия для банка' })
    @ApiResponse({ status: 204 })
    @ApiCookieAuth('access_token')
    @Delete("/:bankId/:consentId")
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@Param() params: object, @User('id') userId: number) {
        await this.consentsService.deleteConsent(params["bankId"], params["consentId"], userId);
    }
}
