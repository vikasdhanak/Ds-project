export type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};

export type Book = {
    id: string;
    title: string;
    author: string;
    description: string;
    filePath: string;
    uploadedBy: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ReadingSession = {
    id: string;
    userId: string;
    bookId: string;
    startTime: Date;
    endTime: Date;
};

export type AuthResponse = {
    token: string;
    user: User;
};

export type UploadResponse = {
    message: string;
    book: Book;
};