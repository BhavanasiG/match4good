/*
  Warnings:

  - You are about to drop the column `primary_category_id` on the `Subcategory` table. All the data in the column will be lost.
  - Added the required column `primaryCategoryId` to the `Subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_primary_category_id_fkey";

-- AlterTable
ALTER TABLE "Subcategory" DROP COLUMN "primary_category_id",
ADD COLUMN     "primaryCategoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_primaryCategoryId_fkey" FOREIGN KEY ("primaryCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
