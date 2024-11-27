import { ProductionPlanDecision } from "@prisma/client";

export function findDecision(productionDescicions: ProductionPlanDecision[], materialId: string) {
    for (const decision of productionDescicions) {
        if (decision.materialId === materialId) {
            return decision.safetyStock;
        }
    }

    return null;
}