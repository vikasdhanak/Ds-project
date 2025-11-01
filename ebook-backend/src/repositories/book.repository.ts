import { PrismaClient } from '@prisma/client';

class BookRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createBook(data: { title: string; author: string; pdfUrl: string }) {
        return await this.prisma.book.create({
            data,
        });
    }

    async getAllBooks() {
        return await this.prisma.book.findMany();
    }

    async getBookById(id: number) {
        return await this.prisma.book.findUnique({
            where: { id },
        });
    }

    async updateBook(id: number, data: Partial<{ title: string; author: string; pdfUrl: string }>) {
        return await this.prisma.book.update({
            where: { id },
            data,
        });
    }

    async deleteBook(id: number) {
        return await this.prisma.book.delete({
            where: { id },
        });
    }
}

export default new BookRepository();