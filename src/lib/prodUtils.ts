import { Prisma } from "@prisma/client";

type MaterialWithRelations = Prisma.MaterialGetPayload<{
    include: {
        MaterialsRequired: {
          include: {
            RequiredMaterial: true,
          },
        },
        MaterialsRequiredBy: {
          include: {
            Material: true,
          },
        },
    },
}>;

type WarehouseWithRelations = Prisma.WarehouseGetPayload<{
    include: {
        Material: true,
    };
}>;

export interface ProductionPlan {
    materialId: string;
    warehouseStock: number;
    queueOrders: number;
    workInProgress: number;
    relations: ProductionPlanMultipliers[];
};

export interface ProductionPlanMultipliers {
    materialId: string;
    amount: number;
}

export function getMaterial(materials: MaterialWithRelations[], id: string) {
    for (const material of materials) {
        if (material.id === id) {
            return material;
        }
    }

    return null;
}

export function getWarehouseByMaterialId(warehouse: WarehouseWithRelations[], id: string) {
    for (const material of warehouse) {
        if (material.materialId === id) {
            return material;
        }
    }

    return null;
}

export function getProductionPlan(materials: MaterialWithRelations[], warehouse: WarehouseWithRelations[], id: string) {
    const materialsToDo: string[] = [id];
    const productionPlan: ProductionPlan[] = [];

    while (materialsToDo.length > 0) {
        const materialId = materialsToDo.pop();
        if (materialId) {
            const material = getMaterial(materials, materialId);

            if (material) {
                const listOfMultipliers: ProductionPlanMultipliers[] = [];
                const warehouseStockMaterial = getWarehouseByMaterialId(warehouse, material.id);
                let warehouseStockMaterialAmount;

                if (warehouseStockMaterial) {
                    warehouseStockMaterialAmount = warehouseStockMaterial.amount;
                } else {
                    warehouseStockMaterialAmount = 0
                }

                for (const requiredMaterial of material.MaterialsRequired) {
                    if (requiredMaterial.requiredMaterialId.includes("E")) {
                        listOfMultipliers.push({
                            materialId: requiredMaterial.requiredMaterialId,
                            amount: requiredMaterial.sum,
                        })
                        materialsToDo.push(requiredMaterial.requiredMaterialId);
                    }
                }

                productionPlan.push({
                    materialId: material.id,
                    warehouseStock: warehouseStockMaterialAmount,
                    queueOrders: 0,
                    workInProgress: 0,
                    relations: listOfMultipliers,
                });
            }
        }
    }

    return productionPlan;
}