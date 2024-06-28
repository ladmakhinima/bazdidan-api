/*
  Warnings:

  - Added the required column `estateAgencyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "estateAgencyId" INTEGER NOT NULL,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_estateAgencyId_fkey" FOREIGN KEY ("estateAgencyId") REFERENCES "EstateAgency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
