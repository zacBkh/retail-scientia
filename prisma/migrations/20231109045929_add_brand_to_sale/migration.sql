-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "brandId" INTEGER;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
