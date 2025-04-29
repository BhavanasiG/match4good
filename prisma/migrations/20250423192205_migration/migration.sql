/*
  Warnings:

  - The values [AcceptingApplications,ApplicationsClosed,Completed,Cancelled] on the enum `ListingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `end_datetime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `point_value` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `start_datetime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDatetime` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDatetime` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ListingStatus_new" AS ENUM ('acceptingApplications', 'applicationsClosed', 'completed', 'cancelled');
ALTER TABLE "Listing" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Listing" ALTER COLUMN "status" TYPE "ListingStatus_new" USING ("status"::text::"ListingStatus_new");
ALTER TYPE "ListingStatus" RENAME TO "ListingStatus_old";
ALTER TYPE "ListingStatus_new" RENAME TO "ListingStatus";
DROP TYPE "ListingStatus_old";
ALTER TABLE "Listing" ALTER COLUMN "status" SET DEFAULT 'acceptingApplications';
COMMIT;

-- DropForeignKey
-- ALTER TABLE "Listing" DROP CONSTRAINT "Listing_organization_id_fkey";

-- DropForeignKey
-- ALTER TABLE "Organization" DROP CONSTRAINT "Organization_owner_id_fkey";

-- DropForeignKey
-- ALTER TABLE "User" DROP CONSTRAINT "User_region_id_fkey";

-- DropIndex
-- DROP INDEX "User_user_id_key";

-- AlterTable
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

ALTER TABLE "Listing" 
-- DROP COLUMN "end_datetime",

-- ALTER TABLE "Listing" DROP COLUMN "end_datetime",

-- ALTER TABLE "Listing" DROP COLUMN "end_datetime",

=======
<<<<<<< HEAD
=======
>>>>>>> 47e546e (Fixed prisma migration issue)
ALTER TABLE "Listing" 

-- ALTER TABLE "Listing" DROP COLUMN "end_datetime",
<<<<<<< HEAD
>>>>>>> 76ba511 (Rebase changes)
>>>>>>> 9ebd15b (Rebase changes)
=======
ALTER TABLE "Listing" 
-- DROP COLUMN "end_datetime",
=======
-- ALTER TABLE "Listing" DROP COLUMN "end_datetime",
>>>>>>> 76ba511 (Rebase changes)
>>>>>>> 1ecb8f5 (Rebase changes)
=======
-- ALTER TABLE "Listing" DROP COLUMN "end_datetime",
>>>>>>> 76ba511 (Rebase changes)
=======

>>>>>>> 47e546e (Fixed prisma migration issue)
-- DROP COLUMN "organization_id",
-- DROP COLUMN "point_value",
-- DROP COLUMN "start_datetime",
-- ADD COLUMN     "endDatetime" TIMESTAMP(3) NOT NULL,
-- ADD COLUMN     "organizationId" INTEGER NOT NULL,
-- ADD COLUMN     "pointValue" INTEGER NOT NULL DEFAULT 0,
-- ADD COLUMN     "startDatetime" TIMESTAMP(3) NOT NULL,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
<<<<<<< HEAD
>>>>>>> 9ebd15b (Rebase changes)
=======
>>>>>>> 1ecb8f5 (Rebase changes)
=======

>>>>>>> 47e546e (Fixed prisma migration issue)
ALTER COLUMN "status" SET DEFAULT 'acceptingApplications';

-- AlterTable
-- ALTER TABLE "Organization" 
-- -- DROP COLUMN "owner_id",
-- ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
-- ALTER TABLE "User" 
-- -- DROP COLUMN "region_id",
-- -- DROP COLUMN "user_id",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 9ebd15b (Rebase changes)
=======
=======
>>>>>>> 1ecb8f5 (Rebase changes)
=======

-- ALTER COLUMN "status" SET DEFAULT 'acceptingApplications';

-- AlterTable
-- ALTER TABLE "Organization" DROP COLUMN "owner_id",
-- ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
-- ALTER TABLE "User" DROP COLUMN "region_id",
-- DROP COLUMN "user_id",
>>>>>>> 47e546e (Fixed prisma migration issue)
-- ALTER COLUMN "status" SET DEFAULT 'acceptingApplications';

-- AlterTable
-- ALTER TABLE "Organization" DROP COLUMN "owner_id",
-- ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
-- ALTER TABLE "User" DROP COLUMN "region_id",
-- DROP COLUMN "user_id",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
-- ALTER COLUMN "status" SET DEFAULT 'acceptingApplications';

-- AlterTable
-- ALTER TABLE "Organization" DROP COLUMN "owner_id",
-- ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
-- ALTER TABLE "User" DROP COLUMN "region_id",
-- DROP COLUMN "user_id",
=======
>>>>>>> 76ba511 (Rebase changes)
>>>>>>> 9ebd15b (Rebase changes)
=======
>>>>>>> 76ba511 (Rebase changes)
>>>>>>> 1ecb8f5 (Rebase changes)
=======
-- ALTER COLUMN "status" SET DEFAULT 'acceptingApplications';

-- AlterTable
-- ALTER TABLE "Organization" DROP COLUMN "owner_id",
-- ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
-- ALTER TABLE "User" DROP COLUMN "region_id",
-- DROP COLUMN "user_id",
>>>>>>> 76ba511 (Rebase changes)
=======
>>>>>>> 47e546e (Fixed prisma migration issue)
-- ADD COLUMN     "regionId" INTEGER,
-- ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
-- CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
-- ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "Listing" ADD CONSTRAINT "Listing_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
