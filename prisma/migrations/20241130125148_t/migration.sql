-- CreateTable
CREATE TABLE "Workplace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "overtime" INTEGER,
    "numberOfShifts" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,

    CONSTRAINT "Workplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkplaceMaterial" (
    "workplaceId" INTEGER NOT NULL,
    "materialId" TEXT NOT NULL,
    "periodId" INTEGER NOT NULL,
    "capacityRequired" INTEGER NOT NULL,
    "processingTime" DOUBLE PRECISION NOT NULL,
    "setupTime" DOUBLE PRECISION NOT NULL,
    "procurementTime" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WorkplaceMaterial_pkey" PRIMARY KEY ("workplaceId","materialId","periodId")
);

-- AddForeignKey
ALTER TABLE "Workplace" ADD CONSTRAINT "Workplace_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkplaceMaterial" ADD CONSTRAINT "WorkplaceMaterial_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "Workplace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkplaceMaterial" ADD CONSTRAINT "WorkplaceMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkplaceMaterial" ADD CONSTRAINT "WorkplaceMaterial_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
