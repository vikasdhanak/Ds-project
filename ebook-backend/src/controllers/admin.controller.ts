import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AdminController {
  // Get admin dashboard stats
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }
      
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.'
        });
      }

      // Get all users with their book counts
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          screenName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              books: true,
              library: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Get total stats
      const totalUsers = users.length;
      const totalBooks = await prisma.book.count();
      const totalLibraryItems = await prisma.userLibrary.count();

      res.status(200).json({
        success: true,
        data: {
          stats: {
            totalUsers,
            totalBooks,
            totalLibraryItems
          },
          users: users.map(u => ({
            id: u.id,
            email: u.email,
            screenName: u.screenName,
            role: u.role,
            joinedAt: u.createdAt,
            booksUploaded: u._count.books,
            libraryItems: u._count.library
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all books with uploader info (for admin)
  async getAllBooksAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }
      
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.'
        });
      }

      const books = await prisma.book.findMany({
        include: {
          user: {
            select: {
              email: true,
              screenName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        data: { books }
      });
    } catch (error) {
      next(error);
    }
  }

  // Check if current user is admin
  async checkAdminStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          screenName: true,
          role: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          isAdmin: user.role === 'admin',
          user: {
            id: user.id,
            email: user.email,
            screenName: user.screenName,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get top users ranked by book uploads
  async getTopUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }
      
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.'
        });
      }

      // Get users with their book counts, sorted by most books
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          screenName: true,
          _count: {
            select: {
              books: true
            }
          }
        },
        orderBy: {
          books: {
            _count: 'desc'
          }
        },
        take: 10 // Top 10 users
      });

      // Add rank to each user
      const rankedUsers = users.map((u, index) => ({
        rank: index + 1,
        userId: u.id,
        screenName: u.screenName,
        email: u.email,
        bookCount: u._count.books
      }));

      res.status(200).json({
        success: true,
        data: { topUsers: rankedUsers }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
