/*
  Warnings:

  - You are about to drop the column `rating` on the `Tours` table. All the data in the column will be lost.
  - Added the required column `description` to the `Tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPrice` to the `Tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageCover` to the `Tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxGroupSize` to the `Tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tours" DROP COLUMN "rating",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "discountPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "imageCover" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "maxGroupSize" INTEGER NOT NULL,
ADD COLUMN     "ratingsAverage" DOUBLE PRECISION DEFAULT 4.5,
ADD COLUMN     "ratingsQuantity" INTEGER DEFAULT 0,
ADD COLUMN     "startDates" TEXT[],
ADD COLUMN     "summary" TEXT NOT NULL;
