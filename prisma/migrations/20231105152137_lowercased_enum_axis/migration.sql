/*
  Warnings:

  - The values [PERFUME,BEAUTY,SKINCARE] on the enum `Axis` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Axis_new" AS ENUM ('Perfume', 'Beauty', 'Skincare');
ALTER TABLE "Product" ALTER COLUMN "axis" TYPE "Axis_new" USING ("axis"::text::"Axis_new");
ALTER TYPE "Axis" RENAME TO "Axis_old";
ALTER TYPE "Axis_new" RENAME TO "Axis";
DROP TYPE "Axis_old";
COMMIT;
