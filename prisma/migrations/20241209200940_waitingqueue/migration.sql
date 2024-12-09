-- CreateTable
CREATE TABLE "WaitingQueue" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "firstBatch" INTEGER NOT NULL,
    "lastBatch" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "timeneed" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "WaitingQueue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaitingQueue" ADD CONSTRAINT "WaitingQueue_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitingQueue" ADD CONSTRAINT "WaitingQueue_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
