-- DropForeignKey
ALTER TABLE "AdditionalSale" DROP CONSTRAINT "AdditionalSale_periodId_fkey";

-- AddForeignKey
ALTER TABLE "AdditionalSale" ADD CONSTRAINT "AdditionalSale_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
