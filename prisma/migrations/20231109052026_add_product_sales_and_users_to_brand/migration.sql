/*
  Warnings:

  - You are about to drop the column `userId` on the `Brand` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_userId_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_BrandToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BrandToUser_AB_unique" ON "_BrandToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BrandToUser_B_index" ON "_BrandToUser"("B");

-- AddForeignKey
ALTER TABLE "_BrandToUser" ADD CONSTRAINT "_BrandToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToUser" ADD CONSTRAINT "_BrandToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
