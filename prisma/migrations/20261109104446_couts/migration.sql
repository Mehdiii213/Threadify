-- AlterTable
ALTER TABLE "generation_event" ADD COLUMN     "costUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "inputTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "outputTokens" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "generation_event_createdAt_idx" ON "generation_event"("createdAt");
