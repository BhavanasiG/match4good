-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AcceptingApplications', 'ApplicationsClosed', 'Completed', 'Cancelled');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "point_value" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'AcceptingApplications';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "region_id" INTEGER;

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
