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
