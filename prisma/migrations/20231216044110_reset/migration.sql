/*
  Warnings:

  - You are about to drop the column `pointOfSale` on the `User` table. All the data in the column will be lost.
  - Added the required column `pointOfSaleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pointOfSale",
ADD COLUMN     "pointOfSaleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pointOfSaleId_fkey" FOREIGN KEY ("pointOfSaleId") REFERENCES "PointOfSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
