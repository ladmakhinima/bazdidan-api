/*
  Warnings:

  - Added the required column `consultantId` to the `HouseAd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HouseAd" ADD COLUMN     "consultantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HouseAd" ADD CONSTRAINT "HouseAd_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
