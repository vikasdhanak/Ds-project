import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

export class StreamingService {
    async streamPdf(bookId: string): Promise<Readable> {
        // Return a file read stream from the PDF storage directory
        const filePath = path.join(__dirname, '../../storage/pdf', `${bookId}.pdf`);
        return fs.createReadStream(filePath);
    }
}