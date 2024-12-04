-- CreateTable
CREATE TABLE "AdditionalSale" (
    "id" SERIAL NOT NULL,
    "forPeriod" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "AdditionalSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalSale_periodId_forPeriod_materialId_key" ON "AdditionalSale"("periodId", "forPeriod", "materialId");

-- AddForeignKey
ALTER TABLE "AdditionalSale" ADD CONSTRAINT "AdditionalSale_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalSale" ADD CONSTRAINT "AdditionalSale_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
