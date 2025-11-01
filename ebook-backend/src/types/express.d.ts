import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Add custom properties here, e.g., user information after authentication
      files?: {
        [fieldname: string]: Multer.File[];
      } | Multer.File[];
    }
  }
}