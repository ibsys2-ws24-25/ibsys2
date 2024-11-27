import { Prisma } from '@prisma/client';

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

type ForecastWithRelations = Prisma.ForecastGetPayload<{
    include: {
        Material: true,
    };
}>;

export interface ProductionPlan {
    materialId: string;
    salesPlan: number;
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

export function getForecastForMaterialAndPeriod(forecasts: ForecastWithRelations[], materialId: string, periodId: number) {
    for (const forecast of forecasts) {
        if (forecast.materialId === materialId && forecast.forPeriod === periodId) {
            return forecast.amount;
        }
    }

    return 0;
}

export function getProductionPlan(materials: MaterialWithRelations[], warehouse: WarehouseWithRelations[], forecasts: ForecastWithRelations[], id: string, planedPeriod: number) {
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
                    salesPlan: getForecastForMaterialAndPeriod(forecasts, material.id, planedPeriod),
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
