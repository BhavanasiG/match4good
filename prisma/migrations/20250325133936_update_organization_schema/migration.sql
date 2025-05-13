/*
  Warnings:

  - Made the column `address` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postcode` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address" SET DEFAULT '',
ALTER COLUMN "postcode" SET NOT NULL,
ALTER COLUMN "postcode" SET DEFAULT '';
