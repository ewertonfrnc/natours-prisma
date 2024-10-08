-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "passwordResetExpires" INTEGER,
ADD COLUMN     "passwordResetToken" TEXT;
