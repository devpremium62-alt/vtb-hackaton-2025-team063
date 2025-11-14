import { Injectable } from '@nestjs/common';

export interface KeyProvider {
    getEncryptionKey(): Promise<Buffer>;
}

@Injectable()
export class EnvKeyProvider implements KeyProvider {
    async getEncryptionKey(): Promise<Buffer> {
        const b64 = process.env.ENCRYPTION_KEY_B64;
        if (!b64) {
            throw new Error('ENCRYPTION_KEY_B64 not set');
        }

        const buf = Buffer.from(b64, 'base64');
        if (buf.length !== 32) {
            throw new Error('ENCRYPTION_KEY must be 32 bytes (base64)');
        }

        return buf;
    }
}
