import { NextResponse } from 'next/server';
import { Prisma, PrismaClient, ProductionPlanDecision } from '@prisma/client';
import { getProductionPlan } from '@/lib/prodUtils';
import { findDecision } from '@/lib/manufactoringUtils';

const prisma = new PrismaClient();

// Fetch data from the database
const fetchFromDatabase = async (prisma: PrismaClient, params: { periodId: string }) => {
    const periodId = Number(params.periodId);
    return {
        productionDecisions: await prisma.productionPlanDecision.findMany({ where: { periodId } }),
        materials: await prisma.material.findMany({
            include: {
                MaterialsRequired: { include: { RequiredMaterial: true } },
                MaterialsRequiredBy: { include: { Material: true } },
            },
        }),
        warehouseStock: await prisma.warehouse.findMany({
            where: { periodId },
            include: { Material: true },
        }),
        forecast: await prisma.forecast.findMany({
            where: { periodId, forPeriod: periodId + 1 },
            include: { Material: true },
        }),
        defaultStockSetting: await prisma.setting.findUnique({ where: { name: 'safety_stock_default' } }),
    };
};

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

// Get production relations for all products
const getProductionRelations = (
    materials: MaterialWithRelations[],
    warehouseStock: WarehouseWithRelations[],
    forecast: ForecastWithRelations[],
    periodId: number
) => {
    const products = ["P1", "P2", "P3"];
    return products.flatMap((productId) =>
        getProductionPlan(materials, warehouseStock, forecast, productId, periodId)
    );
};

// Calculate material requirement
const calculateMaterialRequirement = (
    stockAmount: number,
    safetyStock: number,
    predictionValue: number
) => stockAmount - safetyStock - predictionValue;

interface Relation {
    materialId: string;
    amount: number;
}

interface WarehouseStock {
    Material: { id: string };
    amount: number;
}

const getRelationsForMaterial = (materialId: string, materials: MaterialWithRelations[]): Relation[] => {
    const material = materials.find((mat) => mat.id === materialId);
    if (!material || !material.MaterialsRequired) {
        return [];
    }

    return material.MaterialsRequired.map((required) => ({
        materialId: required.RequiredMaterial.id,
        amount: required.sum,
    }));
};

// Process material relations recursively
const processRelations = (
    relations: Relation[],
    manufacturingPlan: Map<string, number>,
    productionDecisions: ProductionPlanDecision[],
    warehouseStock: WarehouseStock[],
    defaultStockSetting: number,
    productionValue: number,
    getRelationsForMaterial: (materialId: string) => Relation[] // Hilfsfunktion, um Relationen zu holen
) => {
    relations.forEach((relation) => {
        if (relation.materialId.includes("E") && !manufacturingPlan.has(relation.materialId)) {
            // Find safety stock decision for relation material
            const safetyStock = findDecision(productionDecisions, relation.materialId) || defaultStockSetting;

            // Find the current warehouse stock for relation material
            const stockEntry = warehouseStock.find((stock) => stock.Material.id === relation.materialId);
            const stockAmount = stockEntry ? stockEntry.amount : 0;

            // Calculate material requirement
            const materialRequirement = stockAmount - safetyStock - relation.amount * productionValue;

            // Only set if production is required
            if (materialRequirement < 0) {
                const requiredProduction = Math.abs(materialRequirement);
                manufacturingPlan.set(relation.materialId, requiredProduction);

                // Rekursiv: Verarbeite weitere Relationen, falls das Material selbst weitere Relationen benötigt
                const subRelations = getRelationsForMaterial(relation.materialId);
                if (subRelations.length > 0) {
                    processRelations(
                        subRelations,
                        manufacturingPlan,
                        productionDecisions,
                        warehouseStock,
                        defaultStockSetting,
                        requiredProduction,
                        getRelationsForMaterial
                    );
                }
            }
        }
    });
};

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
    console.log(`Fetching production plan for ${params.periodId}`);
    try {
        // Fetch required items from db
        const { productionDecisions, materials, warehouseStock, forecast, defaultStockSetting } =
            await fetchFromDatabase(prisma, params);

        console.log(`Num Safety Stock Decisions: ${productionDecisions.length}`);
        console.log(`Num Materials: ${materials.length}`);
        console.log(`Num Warehouse Entries: ${warehouseStock.length}`);
        console.log(`Num Forecast Entries: ${forecast.length}`);
        console.log(`Default Stock Value: ${defaultStockSetting?.value}`);

        // Generate production relations for P1, P2, and P3
        const productionRelations = getProductionRelations(
            materials,
            warehouseStock,
            forecast,
            Number(params.periodId) + 1
        );
        console.log(`Num Production Relations: ${productionRelations.length}`);

        // Create result list
        const manufacturingPlan = new Map<string, number>();
        const predictionValue = 100;

        console.log("--------");
        // Calculate the manufacturing plan
        for (const productionElement of productionRelations) {
            console.log(`Creating plan for ${productionElement.materialId}`);
            // Find safety stock decision for material
            const safetyStockDecision = findDecision(productionDecisions, productionElement.materialId) || Number(defaultStockSetting?.value);

            console.log(`Safety Stock for ${productionElement.materialId} is ${safetyStockDecision}`);

            // Find the current warehouse stock for this material
            const stockEntry = warehouseStock.find((stock) => stock.Material.id === productionElement.materialId);
            const stockAmount = stockEntry ? stockEntry.amount : 0;

            console.log(`Current Stock for ${productionElement.materialId} is ${stockAmount}`);

            // Calculate the end products first
            if (productionElement.materialId.includes("P")) {
                const materialRequirement = calculateMaterialRequirement(
                    stockAmount,
                    safetyStockDecision,
                    predictionValue
                );

                console.log(`Material Requirement for ${productionElement.materialId} is ${materialRequirement}`);
                if (materialRequirement < 0) {
                    const productionValue = Math.abs(materialRequirement);
                    manufacturingPlan.set(productionElement.materialId, productionValue);

                    // Process relations for sub-materials
                    const relations = productionElement.relations;
                    if (relations) {
                        processRelations(
                            relations,
                            manufacturingPlan,
                            productionDecisions,
                            warehouseStock,
                            Number(defaultStockSetting?.value),
                            productionValue,
                            (materialId) => getRelationsForMaterial(materialId, materials) // Neue Hilfsfunktion
                        );
                    }
                } else {
                    manufacturingPlan.set(productionElement.materialId, 0);
                }
            }
        }

        // Convert Map to plain object for JSON response
        const mapToObject = (map: Map<string, number>): object => Object.fromEntries(map);

        // Return the result
        return NextResponse.json(mapToObject(manufacturingPlan), { status: 200 });
    } catch (error) {
        console.error("Error fetching manufacturing plan:", error);
        return NextResponse.json({ error: "Error fetching manufacturing plan" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}