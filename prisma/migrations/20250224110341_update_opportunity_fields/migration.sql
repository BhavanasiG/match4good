/*
  Warnings:

  - You are about to drop the column `opp_description` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `opp_end_date` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `opp_name` on the `Opportunity` table. All the data in the column will be lost.
  - You are about to drop the column `opp_start_date` on the `Opportunity` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "opp_description",
DROP COLUMN "opp_end_date",
DROP COLUMN "opp_name",
DROP COLUMN "opp_start_date",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
