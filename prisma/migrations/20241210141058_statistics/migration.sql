-- CreateTable
CREATE TABLE "Result" (
    "periodId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,
    "average" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_periodId_type_key" ON "Result"("periodId", "type");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
