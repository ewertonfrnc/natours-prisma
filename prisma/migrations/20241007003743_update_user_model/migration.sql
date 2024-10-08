/*
  Warnings:

  - Made the column `passwordResetToken` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "passwordResetToken" SET NOT NULL,
ALTER COLUMN "passwordResetToken" SET DEFAULT '';
