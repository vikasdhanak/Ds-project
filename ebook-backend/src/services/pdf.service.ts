import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PdfService {
    private readonly uploadDir = path.join(__dirname, '../../storage/uploads');

    async uploadPdf(file: Express.Multer.File): Promise<string> {
        const fileId = uuidv4();
        const filePath = path.join(this.uploadDir, `${fileId}-${file.originalname}`);
        await fs.writeFile(filePath, file.buffer);
        return fileId;
    }

    async getPdf(fileId: string): Promise<Buffer> {
        const files = await fs.readdir(this.uploadDir);
        const file = files.find(f => f.startsWith(fileId));
        if (!file) {
            throw new Error('File not found');
        }
        return fs.readFile(path.join(this.uploadDir, file));
    }
}