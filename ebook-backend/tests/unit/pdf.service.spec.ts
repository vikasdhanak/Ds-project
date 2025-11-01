import { PdfService } from '../../src/services/pdf.service';

describe('PdfService', () => {
    let pdfService: PdfService;

    beforeEach(() => {
        pdfService = new PdfService();
    });

    it('should be defined', () => {
        expect(pdfService).toBeDefined();
    });

    // Add more tests for PdfService methods here
});