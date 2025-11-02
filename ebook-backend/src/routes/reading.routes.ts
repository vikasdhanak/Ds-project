import { Router } from 'express';
import { ReadingController } from '../controllers/reading.controller';

const router = Router();
const readingController = new ReadingController();

// Get or start reading session
router.get('/session/:bookId', readingController.getReadingSession);

// Route to stream PDF content
router.get('/stream/:bookId', readingController.streamPDF);

export default router;