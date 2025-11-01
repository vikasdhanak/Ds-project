import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  STORAGE_PATH: process.env.STORAGE_PATH || './storage/uploads',
};

export default env;