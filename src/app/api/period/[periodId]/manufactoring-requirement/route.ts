import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
  const periodId = parseInt(params.periodId);

  try {
    console.log(`Fetching manufacturing requirements for Period ${periodId}`);
    const manufacturingRequirement = new Map<string, number>();

    // Fetch required data
    const materials = await prisma.material.findMany({
      include: { MaterialsRequired: { include: { RequiredMaterial: true } } },
    });
    const forecasts = await prisma.forecast.findMany({
      where: { periodId, forPeriod: periodId },
    });
    const productionSafetyStocks = await prisma.productionPlanDecision.findMany({
      where: { periodId },
    });
    const defaultSafetyStockSetting = await prisma.setting.findUnique({
      where: { name: 'safety_stock_default' },
    });
    const defaultSafetyStock = defaultSafetyStockSetting
      ? parseInt(defaultSafetyStockSetting.value)
      : 0;

    // Helper functions
    const getMaterial = (id: string) => materials.find((m) => m.id === id) || null;
    const getSafetyStock = (materialId: string) => productionSafetyStocks.find((st) => st.materialId === materialId)?.safetyStock || defaultSafetyStock;

    // Recursive function to process requirements
    const processMaterial = (materialId: string, requiredAmount: number) => {
      const material = getMaterial(materialId);
      if (!material) {
        console.error(`Material ${materialId} not found.`);
        return;
      }

      // Update the manufacturing requirement for this material
      const currentRequirement = manufacturingRequirement.get(materialId) || 0;
      manufacturingRequirement.set(materialId, currentRequirement + requiredAmount);

      // Process dependencies recursively
      for (const dependency of material.MaterialsRequired) {
        const dependencyAmount = dependency.sum * requiredAmount;
        processMaterial(dependency.requiredMaterialId, dependencyAmount);
      }
    };

    // Start processing for each forecast
    for (const forecast of forecasts) {
      const safetyStock = getSafetyStock(forecast.materialId);
      const totalRequirement = forecast.amount + safetyStock;

      processMaterial(forecast.materialId, totalRequirement);
    }

    // Convert Map to plain object for JSON response
    const mapToObject = (map: Map<string, number>): object => Object.fromEntries(map);

    // Return the result
    return NextResponse.json(mapToObject(manufacturingRequirement), { status: 200 });
  } catch (error) {
    console.error('Error fetching manufacturing requirements:', error);
    return NextResponse.json({ error: 'Error fetching manufacturing requirements' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}