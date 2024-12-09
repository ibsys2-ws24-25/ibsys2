-- CreateTable
CREATE TABLE "OrderDecision" (
    "amount" INTEGER NOT NULL,
    "mode" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "materialId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDecision_periodId_materialId_key" ON "OrderDecision"("periodId", "materialId");

-- AddForeignKey
ALTER TABLE "OrderDecision" ADD CONSTRAINT "OrderDecision_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDecision" ADD CONSTRAINT "OrderDecision_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
