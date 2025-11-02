import { Router } from 'express';
import LibraryController from '../controllers/library.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const libraryController = new LibraryController();

// All library routes require authentication
router.use(authMiddleware);

router.get('/', libraryController.getUserLibrary);
router.post('/', libraryController.addToLibrary);
router.delete('/:bookId', libraryController.removeFromLibrary);

export default router;
