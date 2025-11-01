import { Router } from 'express';
import { ReadingController } from '../controllers/reading.controller';

const router = Router();
const readingController = new ReadingController();

// Route to start a reading session
router.get('/session/:bookId', readingController.startReadingSession);

// Route to stream PDF content
router.get('/stream/:bookId', readingController.streamPDF);

export default router;