-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "address" TEXT,
ADD COLUMN     "postcode" TEXT;
