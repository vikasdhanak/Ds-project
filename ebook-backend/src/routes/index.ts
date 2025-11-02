import { Router } from 'express';
import authRoutes from './auth.routes';
import booksRoutes from './books.routes';
// import libraryRoutes from './library.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
// router.use('/library', libraryRoutes);

export default router;