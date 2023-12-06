/*
  Warnings:

  - Changed the type of `axis` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/


-- AlterTable
-- Change the type of the "axis" column directly
ALTER TABLE "Product" ALTER COLUMN "axis" TYPE TEXT;
