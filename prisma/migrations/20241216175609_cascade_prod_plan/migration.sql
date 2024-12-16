-- DropForeignKey
ALTER TABLE "productionList" DROP CONSTRAINT "productionList_periodId_fkey";

-- AddForeignKey
ALTER TABLE "productionList" ADD CONSTRAINT "productionList_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
