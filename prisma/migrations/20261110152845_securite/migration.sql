-- DropForeignKey
ALTER TABLE "generation_event" DROP CONSTRAINT "generation_event_userId_fkey";

-- AlterTable
ALTER TABLE "generation_event" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "rate_limit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "lastRequest" BIGINT NOT NULL,

    CONSTRAINT "rate_limit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rate_limit_key_key" ON "rate_limit"("key");

-- AddForeignKey
ALTER TABLE "generation_event" ADD CONSTRAINT "generation_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
