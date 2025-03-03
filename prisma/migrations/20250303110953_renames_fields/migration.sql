/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `end_datetime` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_datetime` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- AlterTable
ALTER TABLE "Listing" RENAME COLUMN "endDateTime" TO "end_datetime";
ALTER TABLE "Listing" RENAME COLUMN "startDateTime" TO "start_datetime";
ALTER TABLE "Listing" RENAME COLUMN "organizationId" TO "organization_id";

-- AlterTable
ALTER TABLE "Organization" RENAME COLUMN "ownerId" TO "owner_id";

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
