-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('IDEE', 'ARTICLE');

-- CreateEnum
CREATE TYPE "CreationFormat" AS ENUM ('CARROUSEL_INSTAGRAM', 'CARROUSEL_LINKEDIN', 'THREAD_X');

-- CreateEnum
CREATE TYPE "CreationStatus" AS ENUM ('BROUILLON');

-- CreateTable
CREATE TABLE "creation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceText" TEXT NOT NULL,
    "format" "CreationFormat" NOT NULL,
    "status" "CreationStatus" NOT NULL DEFAULT 'BROUILLON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "creation_userId_createdAt_idx" ON "creation"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "creation" ADD CONSTRAINT "creation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
