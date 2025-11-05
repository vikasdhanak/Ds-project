-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';

-- Make your admin user (update with your admin email)
UPDATE "User" SET "role" = 'admin' WHERE "email" = 'vikasdhanak181@gmail.com';
