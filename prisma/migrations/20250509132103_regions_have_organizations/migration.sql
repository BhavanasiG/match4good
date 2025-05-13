-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "regionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
