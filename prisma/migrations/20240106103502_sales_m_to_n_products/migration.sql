/*
  Warnings:

  - You are about to drop the column `productId` on the `Sale` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_SaleToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SaleToProduct_AB_unique" ON "_SaleToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_SaleToProduct_B_index" ON "_SaleToProduct"("B");

-- AddForeignKey
ALTER TABLE "_SaleToProduct" ADD CONSTRAINT "_SaleToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SaleToProduct" ADD CONSTRAINT "_SaleToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
