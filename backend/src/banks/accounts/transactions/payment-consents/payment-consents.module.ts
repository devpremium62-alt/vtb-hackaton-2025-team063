import {Module} from '@nestjs/common';
import {PaymentConsentsService} from './payment-consents.service';
import {PaymentConsentsController} from './payment-consents.controller';
import {BanksModule} from "../../../banks.module";
import {ConsentsModule} from "../../../consents/consents.module";

@Module({
    imports: [BanksModule, ConsentsModule],
    providers: [PaymentConsentsService],
    controllers: [PaymentConsentsController],
    exports: [PaymentConsentsService]
})
export class PaymentConsentsModule {
}
