/*
  Warnings:

  - A unique constraint covering the columns `[orderPeriod,materialId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderPeriod_materialId_key" ON "Order"("orderPeriod", "materialId");
