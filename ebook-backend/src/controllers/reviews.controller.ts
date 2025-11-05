import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

/**
 * Create or update a review for a book
 * POST /api/reviews
 */
export const createReview = async (req: Request, res: Response) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Create or update review
    const review = await prisma.review.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
      update: {
        rating,
        comment: comment || ''
      },
      create: {
        userId,
        bookId,
        rating,
        comment: comment || ''
      },
      include: {
        user: {
          select: {
            screenName: true
          }
        }
      }
    });

    // Update book average rating and review count
    const stats = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
      _count: true
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count
      }
    });

    logger.info(`Review ${review.id} created/updated by user ${userId} for book ${bookId}`);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });

  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
};

/**
 * Get all reviews for a specific book
 * GET /api/reviews/:bookId
 */
export const getBookReviews = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            screenName: true
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: [
        { helpfulCount: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    const totalReviews = await prisma.review.count({
      where: { bookId }
    });

    const totalPages = Math.ceil(totalReviews / limit);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          hasMore: page < totalPages
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

/**
 * Mark a review as helpful
 * POST /api/reviews/:id/helpful
 */
export const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted
    const existingVote = await prisma.reviewVote.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId
        }
      }
    });

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.reviewVote.delete({
        where: {
          userId_reviewId: {
            userId,
            reviewId
          }
        }
      });

      await prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { decrement: 1 } }
      });

      logger.info(`User ${userId} removed helpful vote from review ${reviewId}`);

      return res.json({
        success: true,
        data: { voted: false },
        message: 'Vote removed'
      });
    }

    // Add vote
    await prisma.reviewVote.create({
      data: {
        userId,
        reviewId
      }
    });

    await prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: { increment: 1 } }
    });

    logger.info(`User ${userId} marked review ${reviewId} as helpful`);

    res.json({
      success: true,
      data: { voted: true },
      message: 'Review marked as helpful'
    });

  } catch (error) {
    logger.error('Error marking review as helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process vote'
    });
  }
};

/**
 * Update a review
 * PUT /api/reviews/:id
 */
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews'
      });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment })
      },
      include: {
        user: {
          select: {
            screenName: true
          }
        }
      }
    });

    // Update book average rating
    const stats = await prisma.review.aggregate({
      where: { bookId: existingReview.bookId },
      _avg: { rating: true },
      _count: true
    });

    await prisma.book.update({
      where: { id: existingReview.bookId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count
      }
    });

    logger.info(`Review ${reviewId} updated by user ${userId}`);

    res.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    });

  } catch (error) {
    logger.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};

/**
 * Delete a review
 * DELETE /api/reviews/:id
 */
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    const bookId = review.bookId;

    // Delete review (votes will be cascade deleted)
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Update book average rating and review count
    const stats = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
      _count: true
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        averageRating: stats._avg.rating || 0,
        reviewCount: stats._count
      }
    });

    logger.info(`Review ${reviewId} deleted by user ${userId}`);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

/**
 * Get user's review for a specific book
 * GET /api/reviews/my-review/:bookId
 */
export const getUserReview = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const review = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
      include: {
        user: {
          select: {
            screenName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    logger.error('Error fetching user review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review'
    });
  }
};
