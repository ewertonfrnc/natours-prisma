-- CreateTable
CREATE TABLE "Tour" (
    "id" SERIAL NOT NULL,
    "uId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_uId_key" ON "Tour"("uId");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_name_key" ON "Tour"("name");
