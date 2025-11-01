import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateBookData {
  title: string;
  author: string;
  description?: string;
  category: string;
  tags?: string;
  pdfPath: string;
  coverPath?: string;
  uploadedBy: string;
}

interface GetBooksFilter {
  category?: string;
  search?: string;
  page: number;
  limit: number;
}

export class BooksService {
  async createBook(data: CreateBookData) {
    return await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        category: data.category,
        tags: data.tags,
        pdfPath: data.pdfPath,
        coverPath: data.coverPath,
        uploadedBy: data.uploadedBy,
      },
      include: {
        user: {
          select: {
            id: true,
            screenName: true,
            email: true,
          },
        },
      },
    });
  }

  async getAllBooks(filter: GetBooksFilter) {
    const skip = (filter.page - 1) * filter.limit;
    const where: any = {};

    if (filter.category) {
      where.category = filter.category;
    }

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { author: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              screenName: true,
            },
          },
        },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      pagination: {
        page: filter.page,
        limit: filter.limit,
        total,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }

  async getBookById(id: string) {
    return await prisma.book.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            screenName: true,
            email: true,
          },
        },
      },
    });
  }

  async incrementViews(id: string) {
    return await prisma.book.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

}