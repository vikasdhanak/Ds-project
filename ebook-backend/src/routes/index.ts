import { Router } from 'express';
import authRoutes from './auth.routes';
import booksRoutes from './books.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);

export default router;