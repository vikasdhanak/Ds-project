import { Request, Response, NextFunction } from 'express';
import { BooksService } from '../services/books.service';

const booksService = new BooksService();

export class BooksController {
  async uploadBook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      const { title, author, description, category, tags } = req.body;

      if (!files?.pdf || !files.pdf[0]) {
        return res.status(400).json({
          success: false,
          message: 'PDF file is required',
        });
      }

      const bookData = {
        title,
        author,
        description,
        category,
        tags,
        pdfPath: files.pdf[0].path,
        coverPath: files.cover ? files.cover[0].path : undefined,
        uploadedBy: userId,
      };

      const book = await booksService.createBook(bookData);

      res.status(201).json({
        success: true,
        message: 'Book uploaded successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, page = 1, limit = 10 } = req.query;

      const books = await booksService.getAllBooks({
        category: category as string,
        search: search as string,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({
        success: true,
        data: books,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const book = await booksService.getBookById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const book = await booksService.getBookById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      // Increment view count
      await booksService.incrementViews(id);

      // Send the PDF file
      res.sendFile(book.pdfPath, { root: '.' });
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const book = await booksService.getBookById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      // Check if user is the uploader (or you can add admin role check)
      if (book.uploadedBy !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this book',
        });
      }

      await booksService.deleteBook(id);

      res.status(200).json({
        success: true,
        message: 'Book deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}