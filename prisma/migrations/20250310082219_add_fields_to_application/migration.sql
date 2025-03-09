/*
  Warnings:

  - Added the required column `status` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL;
