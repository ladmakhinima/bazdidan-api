/*
  Warnings:

  - You are about to alter the column `managerName` on the `EstateAgency` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `EstateAgency` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `EstateAgency` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "EstateAgency" ALTER COLUMN "managerName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "EstateAgency_name_createdAt_idx" ON "EstateAgency"("name", "createdAt" DESC);
