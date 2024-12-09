import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
  const periodId = parseInt(params.periodId);

  try {
    // console.log(`Fetching manufacturing requirements for Period ${periodId}`);
    const manufacturingRequirement = new Map<string, number>();

    // Fetch required data
    const materials = await prisma.material.findMany({
      include: { MaterialsRequired: { include: { RequiredMaterial: true } } },
    });
    const forecasts = await prisma.forecast.findMany({
      where: { periodId, forPeriod: periodId },
    });
    const productionSafetyStocks = await prisma.productionPlanDecision.findMany({
      where: { periodId, forPeriod: periodId },
    });
    const additionalSaleWishes = await prisma.additionalSale.findMany({
      where: { periodId, forPeriod: periodId },
    });
    const defaultSafetyStockSetting = await prisma.setting.findUnique({
      where: { name: 'safety_stock_default' },
    });
    const defaultSafetyStock = defaultSafetyStockSetting
      ? parseInt(defaultSafetyStockSetting.value)
      : 0;
    const warehouseStocks = await prisma.warehouse.findMany({
      where: { periodId: periodId },
    });

    // Helper functions
    const getMaterial = (id: string) => materials.find((m) => m.id === id) || null;
    const getSafetyStock = (materialId: string) => productionSafetyStocks.find((st) => st.materialId === materialId)?.safetyStock || defaultSafetyStock;
    const getWarehouseStock = (materialId: string) => warehouseStocks.find((ws) => ws.materialId === materialId)?.amount || 0;
    const updateWarehouseStock = (materialId: string, value: number) => {
      const warehouseStock = warehouseStocks.find((ws) => ws.materialId === materialId);
      if (warehouseStock) {
        warehouseStock.amount = Math.max(0, value);
      } else {
        console.warn(`Warehouse stock for material ${materialId} not found.`);
      }
    };

    // Start processing for each forecast
    const addRequirements = (materialId: string, amount: number) => {
      const material = getMaterial(materialId);
      const safetyStock = getSafetyStock(materialId);
      const additionalSaleWish = additionalSaleWishes.find(as => (as.materialId === materialId))?.amount || 0;
      const warehouseStock = getWarehouseStock(materialId);
      const totalRequirement = amount + safetyStock + additionalSaleWish;
      // console.log(`Adding Material ${materialId}`)
      // console.log(`Total Requirement: ${totalRequirement}`);

      if (warehouseStock < totalRequirement) {
        updateWarehouseStock(materialId, 0);
        manufacturingRequirement.set(materialId, totalRequirement - warehouseStock);
        // console.log(material?.MaterialsRequired);
        if (material?.MaterialsRequired) {
          for (const subMaterial of material?.MaterialsRequired) {
            if (subMaterial.requiredMaterialId.includes("E")) {
              addRequirements(subMaterial.requiredMaterialId, (totalRequirement - warehouseStock) * subMaterial.sum);
            }
          }
        }
      } else {
        updateWarehouseStock(materialId, warehouseStock - totalRequirement);
      }
    };

    for (const forecast of forecasts) {
      addRequirements(forecast.materialId, forecast.amount);
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