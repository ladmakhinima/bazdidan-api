-- CreateEnum
CREATE TYPE "HouseAdType" AS ENUM ('SIMPLE', 'SPECIAL');

-- CreateEnum
CREATE TYPE "HouseType" AS ENUM ('RENT', 'MORTGAGE', 'BUY');

-- CreateTable
CREATE TABLE "HouseAd" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "HouseAdType" NOT NULL DEFAULT 'SIMPLE',
    "pricePerMeter" MONEY NOT NULL,
    "houseType" "HouseType" NOT NULL,
    "description" TEXT NOT NULL,
    "yearOfConstruction" VARCHAR(255) NOT NULL,
    "attachments" TEXT[],
    "meterage" INTEGER NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "options" TEXT[],
    "estateAgencyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HouseAd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HouseAd_title_key" ON "HouseAd"("title");

-- CreateIndex
CREATE INDEX "HouseAd_houseType_roomNumber_yearOfConstruction_idx" ON "HouseAd"("houseType", "roomNumber", "yearOfConstruction" DESC);

-- AddForeignKey
ALTER TABLE "HouseAd" ADD CONSTRAINT "HouseAd_estateAgencyId_fkey" FOREIGN KEY ("estateAgencyId") REFERENCES "EstateAgency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
