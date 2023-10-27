/*
  Warnings:

  - A unique constraint covering the columns `[timePeriod]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timePeriod` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "timePeriod" TEXT NOT NULL,
ALTER COLUMN "isSet" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Product_timePeriod_key" ON "Product"("timePeriod");
