import { ValueTransformer } from 'typeorm';
import { CryptoService } from './crypto.service';

export const encryptedTransformerFactory = (cryptoService: CryptoService): ValueTransformer => ({
    to: (plain?: string) => {
        if (plain == null) {
            return null;
        }

        const enc = cryptoService.encrypt(plain);
        return JSON.stringify(enc);
    },
    from: (dbValue?: string) => {
        if (!dbValue) {
            return null;
        }

        try {
            const parsed = typeof dbValue === 'string' ? JSON.parse(dbValue) : dbValue;
            return cryptoService.decrypt(parsed);
        } catch (e) {
            return dbValue;
        }
    },
});
