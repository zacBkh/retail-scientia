/*
  Warnings:

  - You are about to drop the column `brandId` on the `Sale` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_brandId_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "brandId";
