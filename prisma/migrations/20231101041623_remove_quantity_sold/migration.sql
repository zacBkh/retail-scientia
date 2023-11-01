/*
  Warnings:

  - You are about to drop the column `priceSold` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "priceSold",
DROP COLUMN "quantity";
