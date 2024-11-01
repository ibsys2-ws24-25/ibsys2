/*
  Warnings:

  - Added the required column `requiredMaterialId` to the `MaterialRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MaterialRequirement" ADD COLUMN     "requiredMaterialId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MaterialRequirement" ADD CONSTRAINT "MaterialRequirement_requiredMaterialId_fkey" FOREIGN KEY ("requiredMaterialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
