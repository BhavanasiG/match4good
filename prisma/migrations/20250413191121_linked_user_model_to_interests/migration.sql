-- CreateTable
CREATE TABLE "_SubcategoryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubcategoryToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubcategoryToUser_B_index" ON "_SubcategoryToUser"("B");

-- AddForeignKey
ALTER TABLE "_SubcategoryToUser" ADD CONSTRAINT "_SubcategoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubcategoryToUser" ADD CONSTRAINT "_SubcategoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
