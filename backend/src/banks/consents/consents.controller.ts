import {Body, Controller, Delete, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {ConsentsService} from "./consents.service";
import {CreateConsentDto} from "./consent.dto";
import {User} from "../../common/decorators/user.decorator";

@Controller('consents')
export class ConsentsController {
    public constructor(private consentsService: ConsentsService) {
    }

    @Post("/:bankId")
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    public async create(@Param("bankId") bankId: string, @User('id') userId: number, @Body() createConsentDto: CreateConsentDto) {
        return this.consentsService.createConsent(bankId, userId, createConsentDto);
    }

    @Delete("/:bankId/:consentId")
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@Param() params: object, @User('id') userId: number) {
        await this.consentsService.deleteConsent(params["bankId"], params["consentId"], userId);
    }
}
