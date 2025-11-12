import {Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PaymentConsentsService} from "./payment-consents.service";
import {JwtAuthGuard} from "../../../../auth/jwt-auth.guard";
import {User} from "../../../../common/decorators/user.decorator";
import {PaymentConsentDTO} from "./payment-consent.dto";

@ApiTags("Разрешения на переводы")
@Controller('payment-consents')
export class PaymentConsentsController {
    constructor(private readonly paymentConsentService: PaymentConsentsService) {}

    @ApiOperation({summary: 'Создание разрешения на переводы'})
    @ApiResponse({status: 201, description: 'Созданное разрешение'})
    @ApiCookieAuth('access_token')
    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    public create(@User("id") userId: number, @Body() paymentConsentDTO: PaymentConsentDTO) {
        return this.paymentConsentService.createPaymentConsent(userId, paymentConsentDTO);
    }
}
