-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pointOfSaleId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pointOfSaleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pointOfSaleId_fkey" FOREIGN KEY ("pointOfSaleId") REFERENCES "PointOfSale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
