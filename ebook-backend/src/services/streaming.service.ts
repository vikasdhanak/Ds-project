import { Readable } from 'stream';
import { PdfService } from './pdf.service';
import { StorageService } from './storage.service';

export class StreamingService {
    private pdfService: PdfService;
    private storageService: StorageService;

    constructor() {
        this.pdfService = new PdfService();
        this.storageService = new StorageService();
    }

    async streamPdf(bookId: string): Promise<Readable> {
        const filePath = await this.storageService.getFilePath(bookId);
        return this.pdfService.createReadStream(filePath);
    }
}