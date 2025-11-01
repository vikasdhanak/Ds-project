import { Router } from 'express';
import { BooksController } from '../controllers/books.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const router = Router();
const booksController = new BooksController();

router.post('/', authMiddleware, uploadMiddleware, booksController.uploadBook);
router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBookById);
router.get('/:id/file', booksController.getBookFile);

export default router;