/*
  Warnings:

  - You are about to drop the column `bannerPictureFileId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `bannerPictureUrl` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureFileId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "bannerPictureFileId",
DROP COLUMN "bannerPictureUrl",
DROP COLUMN "profilePictureFileId",
DROP COLUMN "profilePictureUrl",
ADD COLUMN     "orgBannerFileId" TEXT,
ADD COLUMN     "orgBannerUrl" TEXT,
ADD COLUMN     "orgPictureFileId" TEXT,
ADD COLUMN     "orgPictureUrl" TEXT;

-- CreateIndex
CREATE INDEX "Organization_ownerId_idx" ON "Organization"("ownerId");

-- CreateIndex
CREATE INDEX "Organization_regionId_idx" ON "Organization"("regionId");
