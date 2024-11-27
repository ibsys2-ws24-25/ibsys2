import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getProductionPlan } from '@/lib/prodUtils';
import { findDecision } from '@/lib/manufactoringUtils';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { periodId: string, productId: string } }) {
    console.log(`Fetching production plan for ${params.periodId} and product ${params.productId}`);
    try {
        // Fetch required items from db
        const productionDescicions = await prisma.productionPlanDecision.findMany({
            where: {
                periodId: Number(params.periodId),
            },
        });

        console.log(`Num Safety Stock Decisions: ${productionDescicions.length}`);

        const materials = await prisma.material.findMany({
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
        });

        console.log(`Num Materials: ${materials.length}`);

        const warehouseStock = await prisma.warehouse.findMany({
            where: {
                periodId: Number(params.periodId),
            },
            include: {
                Material: true,
            },
        });

        console.log(`Num Warehouse Entries: ${warehouseStock.length}`);

        const forecast = await prisma.forecast.findMany({
            where: {
                periodId: Number(params.periodId),
                forPeriod: Number(params.periodId) + 1,
            },
            include: {
                Material: true,
            },
        });

        console.log(`Num Forecast Entries: ${forecast.length}`);

        const defaultStockSetting = await prisma.setting.findUnique({
            where: { name: 'safety_stock_default' },
        });

        console.log(`Default Stock Value: ${defaultStockSetting?.value}`);

        const productionRelationsP1 = getProductionPlan(materials, warehouseStock, forecast, "P1", Number(params.periodId) + 1);
        const productionRelationsP2 = getProductionPlan(materials, warehouseStock, forecast, "P2", Number(params.periodId) + 1);
        const productionRelationsP3 = getProductionPlan(materials, warehouseStock, forecast, "P3", Number(params.periodId) + 1);
        const productionRelations = productionRelationsP1.concat(productionRelationsP2).concat(productionRelationsP3);
        console.log(`Num Production Relations: ${productionRelations.length}`);

        // Create result list
        const manufacturingPlan = new Map<string, number>();

        // Mock data || ToDo: fetch real Data from ahmads work
        const predictionValue = 100;

        console.log("--------");
        // Calc the manufactoring plan
        for (const productionElement of productionRelations) {
            console.log(`Creating plan for ${productionElement.materialId}`);
            // Find safety stock decision for material
            let safetyStockDecision = findDecision(productionDescicions, productionElement.materialId);
            if (!safetyStockDecision) {
                safetyStockDecision = Number(defaultStockSetting?.value);
            }

            console.log(`Safety Stock for ${productionElement.materialId} id ${safetyStockDecision}`);

            // Find the current warehouse stock for this material
            const stockEntry = warehouseStock.find(stock => stock.Material.id === productionElement.materialId);

            // Get the actual stock amount or fallback to 0 if not found
            const currentStock = stockEntry ? stockEntry.amount : 0;

            console.log(`Current Stock for ${productionElement.materialId} id ${currentStock}`);

            // Calc the end products first
            if (productionElement.materialId.includes("P")) {
                // Set the production amount
                const materialRequirement = currentStock - safetyStockDecision - predictionValue;
                console.log(`Material Requirement for ${productionElement.materialId} id ${materialRequirement}`)
                if (materialRequirement < 0) {
                    const productionValue = Math.abs(materialRequirement);
                    manufacturingPlan.set(productionElement.materialId, productionValue);

                    // Set Production relations
                    const relations = productionRelations.find(material => material.materialId === productionElement.materialId)?.relations;

                    if (relations) {
                        for (const relation of relations) {
                            if (relation.materialId.includes("E")) {
                                if (!manufacturingPlan.has(relation.materialId)) {
                                    let safetyStockDecisionRelation = findDecision(productionDescicions, relation.materialId);
                                    if (!safetyStockDecisionRelation) {
                                        safetyStockDecisionRelation = Number(defaultStockSetting?.value);
                                    }

                                    // Find the current warehouse stock for relation material
                                    const stockEntryRelation = warehouseStock.find(stock => stock.Material.id === relation.materialId);

                                    // Get the actual stock amount or fallback to 0 if not found
                                    const currentStockRelation = stockEntryRelation ? stockEntryRelation.amount : 0;

                                    const materialRequirementRelation = currentStockRelation - safetyStockDecisionRelation - (relation.amount * productionValue);

                                    // Only set if production is required
                                    if (materialRequirementRelation < 0) {
                                        manufacturingPlan.set(relation.materialId, Math.abs(materialRequirementRelation));
                                    }
                                }
                            }
                        }
                    }
                } else {
                    manufacturingPlan.set(productionElement.materialId, 0);
                }
            } else {
                if (productionElement.materialId.includes("E")) {
                    if (!manufacturingPlan.has(productionElement.materialId)) {
                        const materialRequirement = currentStock - safetyStockDecision;

                        if (materialRequirement < 0) {
                            // We want to increase our safety stock --> Produce material
                            const productionValue = Math.abs(materialRequirement);
                            manufacturingPlan.set(productionElement.materialId, productionValue);

                            // Add relations because we want to produce
                            const relations = productionRelations.find(material => material.materialId === productionElement.materialId)?.relations;
                            if (relations) {
                                for (const relation of relations) {
                                    if (relation.materialId.includes("E")) {
                                        if (!manufacturingPlan.has(relation.materialId)) {
                                            let safetyStockDecisionRelation = findDecision(productionDescicions, relation.materialId);
                                            if (!safetyStockDecisionRelation) {
                                                safetyStockDecisionRelation = Number(defaultStockSetting?.value);
                                            }
        
                                            // Find the current warehouse stock for relation material
                                            const stockEntryRelation = warehouseStock.find(stock => stock.Material.id === relation.materialId);
        
                                            // Get the actual stock amount or fallback to 0 if not found
                                            const currentStockRelation = stockEntryRelation ? stockEntryRelation.amount : 0;
        
                                            const materialRequirementRelation = currentStockRelation - safetyStockDecisionRelation - (relation.amount * productionValue);
        
                                            // Only set if production is required
                                            if (materialRequirementRelation < 0) {
                                                manufacturingPlan.set(relation.materialId, Math.abs(materialRequirementRelation));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Map in ein einfaches Objekt umwandeln
        const mapToObject = (map: Map<string, number>): object => {
            return Object.fromEntries(map);
        };

        // Rückgabe als JSON-Response
        return NextResponse.json(mapToObject(manufacturingPlan), { status: 200 });
    } catch (error) {
        console.error("Error fetching manufactoring plan:", error);
        return NextResponse.json({ error: "Error fetching manufactoring plan" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
