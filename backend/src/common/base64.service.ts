import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class Base64Service {
    async saveBase64Image(base64Data: string): Promise<string> {
        try {
            const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
            if (!matches) {
                throw new BadRequestException('Неверный формат изображения');
            }

            const mimeType = matches[1];
            const extension = mimeType.split('/')[1];
            const buffer = Buffer.from(matches[2], 'base64');

            const uploadDir = join(__dirname, '..', '..', 'uploads');
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir);
            }

            const filename = `avatar-${crypto.randomUUID()}.${extension}`;
            const filePath = join(uploadDir, filename);

            writeFileSync(filePath, buffer);

            return `/uploads/${filename}`;
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Ошибка при сохранении изображения');
        }
    }
}
