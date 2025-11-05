import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// Check admin status
router.get('/check', adminController.checkAdminStatus);

// Get dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// Get all books with uploader info
router.get('/books', adminController.getAllBooksAdmin);

// Get top users ranked by book uploads
router.get('/top-users', adminController.getTopUsers);

export default router;
