import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LibraryController {
  // Get user's library
  async getUserLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const library = await prisma.userLibrary.findMany({
        where: { userId },
        include: {
          book: true
        }
      });

      return res.json({
        success: true,
        data: { books: library.map((item: any) => item.book) }
      });
    } catch (error) {
      next(error);
    }
  }

  // Add book to library
  async addToLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { bookId } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (!bookId) {
        return res.status(400).json({ success: false, message: 'Book ID is required' });
      }

      // Check if book exists
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }

      // Check if already in library
      const existing = await prisma.userLibrary.findFirst({
        where: {
          userId,
          bookId
        }
      });

      if (existing) {
        return res.status(400).json({ success: false, message: 'Book already in library' });
      }

      // Add to library
      await prisma.userLibrary.create({
        data: {
          userId,
          bookId
        }
      });

      return res.json({
        success: true,
        message: 'Book added to library'
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove book from library
  async removeFromLibrary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { bookId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      await prisma.userLibrary.deleteMany({
        where: {
          userId,
          bookId
        }
      });

      return res.json({
        success: true,
        message: 'Book removed from library'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LibraryController;
