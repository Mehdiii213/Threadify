-- AlterEnum
ALTER TYPE "CreationStatus" ADD VALUE 'GENERE';

-- AlterTable
ALTER TABLE "creation" ADD COLUMN     "content" JSONB,
ADD COLUMN     "generatedAt" TIMESTAMP(3),
ADD COLUMN     "model" TEXT;
