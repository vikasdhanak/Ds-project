import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as reviewsController from '../controllers/reviews.controller';

const router = Router();

/**
 * @route   POST /api/reviews
 * @desc    Create or update a review for a book
 * @access  Private (requires authentication)
 */
router.post('/', authMiddleware, reviewsController.createReview);

/**
 * @route   GET /api/reviews/:bookId
 * @desc    Get all reviews for a specific book (with pagination)
 * @access  Public
 */
router.get('/:bookId', reviewsController.getBookReviews);

/**
 * @route   GET /api/reviews/my-review/:bookId
 * @desc    Get current user's review for a book
 * @access  Private (requires authentication)
 */
router.get('/my-review/:bookId', authMiddleware, reviewsController.getUserReview);

/**
 * @route   POST /api/reviews/:id/helpful
 * @desc    Mark a review as helpful (toggle)
 * @access  Private (requires authentication)
 */
router.post('/:id/helpful', authMiddleware, reviewsController.markReviewHelpful);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review (only by the author)
 * @access  Private (requires authentication)
 */
router.put('/:id', authMiddleware, reviewsController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review (only by the author)
 * @access  Private (requires authentication)
 */
router.delete('/:id', authMiddleware, reviewsController.deleteReview);

export default router;
