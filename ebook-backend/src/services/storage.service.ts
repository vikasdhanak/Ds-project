import fs from 'fs';
import path from 'path';

class StorageService {
    private uploadDir: string;
    private pdfDir: string;

    constructor() {
        this.uploadDir = path.join(__dirname, '../../storage/uploads');
        this.pdfDir = path.join(__dirname, '../../storage/pdf');
    }

    public async saveFile(file: Express.Multer.File): Promise<string> {
        const filePath = path.join(this.uploadDir, file.originalname);
        await fs.promises.writeFile(filePath, file.buffer);
        return filePath;
    }

    public async getFile(fileName: string): Promise<Buffer> {
        const filePath = path.join(this.pdfDir, fileName);
        return await fs.promises.readFile(filePath);
    }

    public async listFiles(): Promise<string[]> {
        return await fs.promises.readdir(this.uploadDir);
    }
}

export default new StorageService();