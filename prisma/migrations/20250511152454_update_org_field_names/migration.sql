/*
  Warnings:

  - You are about to drop the column `orgBannerFileId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `orgBannerUrl` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "orgBannerFileId",
DROP COLUMN "orgBannerUrl",
ADD COLUMN     "bannerPictureFileId" TEXT,
ADD COLUMN     "bannerPictureUrl" TEXT;
