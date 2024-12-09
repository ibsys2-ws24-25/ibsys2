/*
  Warnings:

  - The primary key for the `WorkplaceMaterial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `periodId` on the `WorkplaceMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `setupTime` on the `WorkplaceMaterial` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Workplace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `setupTime` to the `Workplace` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `Workplace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "WorkplaceMaterial" DROP CONSTRAINT "WorkplaceMaterial_periodId_fkey";

-- DropForeignKey
ALTER TABLE "WorkplaceMaterial" DROP CONSTRAINT "WorkplaceMaterial_workplaceId_fkey";

-- AlterTable
ALTER TABLE "Workplace" ADD COLUMN     "setupTime" DOUBLE PRECISION NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkplaceMaterial" DROP CONSTRAINT "WorkplaceMaterial_pkey",
DROP COLUMN "periodId",
DROP COLUMN "setupTime",
ALTER COLUMN "capacityRequired" DROP NOT NULL,
ALTER COLUMN "processingTime" DROP NOT NULL,
ADD CONSTRAINT "WorkplaceMaterial_pkey" PRIMARY KEY ("workplaceId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Workplace_name_key" ON "Workplace"("name");

-- AddForeignKey
ALTER TABLE "WorkplaceMaterial" ADD CONSTRAINT "WorkplaceMaterial_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
