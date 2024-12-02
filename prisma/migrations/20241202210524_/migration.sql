/*
  Warnings:

  - You are about to drop the column `setupTime` on the `Workplace` table. All the data in the column will be lost.
  - The primary key for the `WorkplaceMaterial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `numberOfShifts` on table `Workplace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `periodId` on table `Workplace` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WorkplaceMaterial" DROP CONSTRAINT "WorkplaceMaterial_workplaceId_fkey";

-- DropIndex
DROP INDEX "Workplace_name_key";

-- AlterTable
ALTER TABLE "Workplace" DROP COLUMN "setupTime",
ALTER COLUMN "capacity" DROP DEFAULT,
ALTER COLUMN "numberOfShifts" SET NOT NULL,
ALTER COLUMN "periodId" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "WorkplaceMaterial" DROP CONSTRAINT "WorkplaceMaterial_pkey",
ALTER COLUMN "workplaceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "WorkplaceMaterial_pkey" PRIMARY KEY ("workplaceId", "materialId");

-- CreateTable
CREATE TABLE "WorkplaceHelper" (
    "id" TEXT NOT NULL,
    "maxCapacityPerShift" INTEGER NOT NULL DEFAULT 2400,
    "setupTime" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WorkplaceHelper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkplaceHelper_id_key" ON "WorkplaceHelper"("id");

-- AddForeignKey
ALTER TABLE "WorkplaceMaterial" ADD CONSTRAINT "WorkplaceMaterial_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "WorkplaceHelper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
