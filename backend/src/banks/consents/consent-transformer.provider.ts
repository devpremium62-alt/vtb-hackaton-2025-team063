import { Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Consent } from './consent.entity';
import {CryptoService} from "../../crypto/crypto.service";
import {encryptedTransformerFactory} from "../../crypto/typeorm-transformer";

export const ConsentTransformerProvider: Provider = {
    provide: 'CONSENT_TRANSFORMER_PATCH',
    useFactory: (dataSource, crypto: CryptoService) => {
        const metadata = dataSource.getMetadata(Consent);

        const column = metadata.columns.find(col => col.propertyName === 'consentId');

        column.transformer = encryptedTransformerFactory(crypto);

        return true;
    },
    inject: [getDataSourceToken(), CryptoService],
};
