/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderPeriod,materialId,periodId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `periodId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_orderPeriod_materialId_key";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "id",
ADD COLUMN     "periodId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderPeriod_materialId_periodId_key" ON "Order"("orderPeriod", "materialId", "periodId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
