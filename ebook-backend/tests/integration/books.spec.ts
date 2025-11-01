import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/env';

describe('Books Integration Tests', () => {
  beforeAll(async () => {
    await prisma.book.deleteMany(); // Clean up the database before tests
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Disconnect from the database after tests
  });

  it('should upload a new book', async () => {
    const response = await request(app)
      .post('/api/books/upload')
      .attach('file', 'path/to/sample.pdf'); // Replace with a valid PDF path

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Sample Book Title'); // Adjust based on your book title logic
  });

  it('should retrieve a list of books', async () => {
    const response = await request(app).get('/api/books');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should retrieve a specific book by ID', async () => {
    const bookId = 1; // Replace with a valid book ID from your database
    const response = await request(app).get(`/api/books/${bookId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', bookId);
  });
});