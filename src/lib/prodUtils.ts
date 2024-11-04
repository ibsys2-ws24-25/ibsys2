import { Material } from "@prisma/client";

export function getMaterial(materials: Material[], id: string) {
    for (const material of materials) {
        if (material.id === id) {
            return material;
        }
    }

    return null;
}