-- AlterTable
ALTER TABLE "WaitingQueue" ALTER COLUMN "firstBatch" DROP NOT NULL,
ALTER COLUMN "lastBatch" DROP NOT NULL;
