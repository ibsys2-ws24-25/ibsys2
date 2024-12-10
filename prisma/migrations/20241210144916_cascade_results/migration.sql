-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_periodId_fkey";

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
