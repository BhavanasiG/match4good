/*
  Warnings:

  - You are about to drop the column `end_date` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `endDateTime` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
