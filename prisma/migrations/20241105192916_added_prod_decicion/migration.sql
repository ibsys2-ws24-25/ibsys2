-- CreateTable
CREATE TABLE "ProductionPlanDecision" (
    "id" SERIAL NOT NULL,
    "periodId" INTEGER NOT NULL,
    "materialId" TEXT NOT NULL,
    "safetyStock" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductionPlanDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionPlanDecision_periodId_materialId_productId_key" ON "ProductionPlanDecision"("periodId", "materialId", "productId");

-- AddForeignKey
ALTER TABLE "ProductionPlanDecision" ADD CONSTRAINT "ProductionPlanDecision_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPlanDecision" ADD CONSTRAINT "ProductionPlanDecision_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
