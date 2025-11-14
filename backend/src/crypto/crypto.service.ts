import { Injectable } from '@nestjs/common';
import { type KeyProvider } from './key.provider';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
    private encKey!: Buffer;

    constructor(private readonly keyProvider: KeyProvider) {}

    async onModuleInit() {
        this.encKey = await this.keyProvider.getEncryptionKey();
    }

    encrypt(plain: string) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.encKey, iv);
        const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return {
            iv: iv.toString('base64'),
            ciphertext: ciphertext.toString('base64'),
            tag: tag.toString('base64'),
        };
    }

    decrypt(payload: { iv: string; ciphertext: string; tag: string; }) {
        const iv = Buffer.from(payload.iv, 'base64');
        const ciphertext = Buffer.from(payload.ciphertext, 'base64');
        const tag = Buffer.from(payload.tag, 'base64');

        const decipher = crypto.createDecipheriv('aes-256-gcm', this.encKey, iv);
        decipher.setAuthTag(tag);

        const out = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        return out.toString('utf8');
    }
}