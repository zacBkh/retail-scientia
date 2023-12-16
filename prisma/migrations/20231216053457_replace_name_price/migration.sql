/*
  Warnings:

  - You are about to drop the column `regularPrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `currentPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "regularPrice",
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL;
