-- DropForeignKey
ALTER TABLE "Forecast" DROP CONSTRAINT "Forecast_periodId_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_periodId_fkey";

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
