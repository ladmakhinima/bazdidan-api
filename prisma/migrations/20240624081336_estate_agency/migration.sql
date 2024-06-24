-- CreateEnum
CREATE TYPE "EstateAgencyStatus" AS ENUM ('APPROVE', 'NOT_APPROVE', 'BLOCK');

-- CreateTable
CREATE TABLE "EstateAgency" (
    "id" SERIAL NOT NULL,
    "managerName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "EstateAgencyStatus" NOT NULL DEFAULT 'NOT_APPROVE',
    "logo" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "EstateAgency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EstateAgency_name_key" ON "EstateAgency"("name");
