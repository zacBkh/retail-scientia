/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `axis` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Axis" AS ENUM ('PERFUME', 'BEAUTY', 'SKINCARE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "axis" "Axis" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_productId_key" ON "Sale"("productId");
