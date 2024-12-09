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

    // Recursive function to process requirements
    const processMaterial = (materialId: string, requiredAmount: number) => {
      const material = getMaterial(materialId);
      if (!material) {
        console.error(`Material ${materialId} not found.`);
        return;
      }

      // Update the manufacturing requirement for this material
      const currentRequirement = manufacturingRequirement.get(materialId) || 0;

      let requirementAfterWarehouse = 0;
      if (!materialId.includes("P")) {
        requirementAfterWarehouse = getWarehouseStock(materialId) - currentRequirement - requiredAmount - getSafetyStock(materialId);
      } else {
        requirementAfterWarehouse = getWarehouseStock(materialId) - currentRequirement - requiredAmount;
      }

      if (requirementAfterWarehouse < 0) {
        manufacturingRequirement.set(materialId, Math.abs(requirementAfterWarehouse));
      }

      // console.log(`Material ${materialId}: WHs: ${getWarehouseStock(materialId)}; currentRequirement: ${currentRequirement}; requiredAmount: ${requiredAmount}; requiredAfterWarehouse: ${Math.abs(requirementAfterWarehouse)}`);

      // Reduce Warehouse entry
      if (getWarehouseStock(materialId) > 0) {
        if (requirementAfterWarehouse < 0) {
          updateWarehouseStock(materialId, 0);
        } else {
          updateWarehouseStock(materialId, requirementAfterWarehouse);
        }
      }

      // Process dependencies recursively
      for (const dependency of material.MaterialsRequired) {
        if (requirementAfterWarehouse < 0) {
          const dependencyAmount = dependency.sum * Math.abs(requirementAfterWarehouse);
          // console.log(`API Call: processMaterial(${dependency.requiredMaterialId}, ${Math.abs(requirementAfterWarehouse)})`)
          processMaterial(dependency.requiredMaterialId, dependencyAmount);
        }
      }
    };

    // Start processing for each forecast
    for (const forecast of forecasts) {
      const safetyStock = getSafetyStock(forecast.materialId);
      const additionalSaleWish = additionalSaleWishes.find(as => (as.materialId === forecast.materialId))?.amount || 0;
      const warehouseStock = getWarehouseStock(forecast.materialId);
      const totalRequirement = forecast.amount + safetyStock + additionalSaleWish;
      // console.log(`Product ${forecast.materialId}: ws: ${getWarehouseStock(forecast.materialId)}; fc: ${forecast.amount}; ss: ${safetyStock}; sw: ${additionalSaleWish}`);

      if (warehouseStock < totalRequirement) {
        processMaterial(forecast.materialId, Math.abs(totalRequirement - warehouseStock));
      }
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