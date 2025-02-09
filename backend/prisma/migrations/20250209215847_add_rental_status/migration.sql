-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'ACTIVE', 'FINISHED');

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "status" "RentalStatus" NOT NULL DEFAULT 'PENDING';
