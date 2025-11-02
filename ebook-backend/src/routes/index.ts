import { Router } from 'express';
import authRoutes from './auth.routes';
import booksRoutes from './books.routes';
import usersRoutes from './users.routes';
import libraryRoutes from './library.routes';
import readingRoutes from './reading.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/library', libraryRoutes);
router.use('/users', usersRoutes);
router.use('/reading', readingRoutes);

export default router;
