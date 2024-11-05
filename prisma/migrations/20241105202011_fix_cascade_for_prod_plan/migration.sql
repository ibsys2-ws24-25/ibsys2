-- DropForeignKey
ALTER TABLE "ProductionPlanDecision" DROP CONSTRAINT "ProductionPlanDecision_periodId_fkey";

-- AddForeignKey
ALTER TABLE "ProductionPlanDecision" ADD CONSTRAINT "ProductionPlanDecision_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
