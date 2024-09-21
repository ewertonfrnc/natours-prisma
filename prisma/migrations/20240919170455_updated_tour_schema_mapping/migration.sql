/*
  Warnings:

  - You are about to drop the `Tour` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tour";

-- CreateTable
CREATE TABLE "Tours" (
    "id" SERIAL NOT NULL,
    "uId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Tours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tours_uId_key" ON "Tours"("uId");

-- CreateIndex
CREATE UNIQUE INDEX "Tours_name_key" ON "Tours"("name");
