import { Request, Response } from 'express';
import { StreamingService } from '../services/streaming.service';

export class ReadingController {
    private streamingService: StreamingService;

    constructor() {
        this.streamingService = new StreamingService();
    }

    public streamPDF = async (req: Request, res: Response): Promise<void> => {
        const { bookId } = req.params;
        try {
            const stream = await this.streamingService.streamPdf(bookId);
            stream.pipe(res);
        } catch (error) {
            res.status(500).json({ message: 'Error streaming PDF', error });
        }
    };

    public getReadingSession = async (req: Request, res: Response): Promise<void> => {
        const { sessionId } = req.params;
        // Logic to retrieve reading session details can be added here
        res.status(200).json({ message: 'Reading session details', sessionId });
    };
}