/*
  Warnings:

  - Added the required column `estateAgencyId` to the `ClientRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientRequest" ADD COLUMN     "estateAgencyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientRequest" ADD CONSTRAINT "ClientRequest_estateAgencyId_fkey" FOREIGN KEY ("estateAgencyId") REFERENCES "EstateAgency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
