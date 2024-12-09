-- CreateTable
CREATE TABLE "productionList" (
    "id" SERIAL NOT NULL,
    "periodId" INTEGER NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "productionList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productionList_priority_key" ON "productionList"("priority");

-- AddForeignKey
ALTER TABLE "productionList" ADD CONSTRAINT "productionList_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productionList" ADD CONSTRAINT "productionList_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
