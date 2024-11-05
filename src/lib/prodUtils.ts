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

export function getMaterial(materials: MaterialWithRelations[], id: string) {
    for (const material of materials) {
        if (material.id === id) {
            return material;
        }
    }

    return null;
}

export function getProductionPlan(materials: MaterialWithRelations[], id: string) {
    
}