-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "itemValue" DOUBLE PRECISION NOT NULL,
    "defaultStock" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialRequirement" (
    "id" SERIAL NOT NULL,
    "materialId" TEXT NOT NULL,
    "sum" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MaterialRequirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaterialRequirement" ADD CONSTRAINT "MaterialRequirement_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
