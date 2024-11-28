/*
  Warnings:

  - A unique constraint covering the columns `[periodId,materialId,productId,forPeriod]` on the table `ProductionPlanDecision` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductionPlanDecision_periodId_materialId_productId_key";

-- AlterTable
ALTER TABLE "ProductionPlanDecision" ADD COLUMN     "forPeriod" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ProductionPlanDecision_periodId_materialId_productId_forPer_key" ON "ProductionPlanDecision"("periodId", "materialId", "productId", "forPeriod");
