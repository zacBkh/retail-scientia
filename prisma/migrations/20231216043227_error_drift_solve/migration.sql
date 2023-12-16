/*
  Warnings:

  - You are about to drop the column `pointOfSaleId` on the `User` table. All the data in the column will be lost.
  - Added the required column `pointOfSale` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pointOfSaleId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pointOfSaleId",
ADD COLUMN     "pointOfSale" TEXT NOT NULL;
