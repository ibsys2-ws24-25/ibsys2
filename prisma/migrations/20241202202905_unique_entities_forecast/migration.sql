/*
  Warnings:

  - A unique constraint covering the columns `[periodId,materialId,forPeriod]` on the table `Forecast` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Forecast_periodId_materialId_forPeriod_key" ON "Forecast"("periodId", "materialId", "forPeriod");
