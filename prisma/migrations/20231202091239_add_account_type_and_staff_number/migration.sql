-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Staff', 'Marketing', 'Training', 'Sales', 'Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'Staff',
ADD COLUMN     "staffID" TEXT;
