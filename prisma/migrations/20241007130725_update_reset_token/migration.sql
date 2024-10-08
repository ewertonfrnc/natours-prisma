-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "passwordResetToken" DROP NOT NULL,
ALTER COLUMN "passwordResetToken" DROP DEFAULT;
