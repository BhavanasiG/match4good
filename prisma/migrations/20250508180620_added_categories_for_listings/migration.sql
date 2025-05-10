-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "listingId" INTEGER;

-- AlterTable
ALTER TABLE "Subcategory" ADD COLUMN     "listingId" INTEGER;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
