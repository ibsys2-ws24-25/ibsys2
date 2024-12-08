import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
  const periodId = parseInt(params.periodId);
  try {
    const manufacturingPlan = new Map<string, number>();
    const warehouseStocks = await prisma.warehouse.findMany({
      where: {
        periodId: periodId,
      },
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${periodId}/manufactoring-requirement/`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
        cache: 'no-store',
      });

      if (!response.ok) {
          throw new Error("Failed to fetch production requirement.");
      }

      const data = await response.json();

      const productionPlanMap = new Map<string, number>(Object.entries(data));

      console.log(productionPlanMap);

      for (const materialId of productionPlanMap.keys()) {
        const warehouseStock = warehouseStocks.find(ws => (ws.materialId === materialId))?.amount || 0;
        const requirement = (productionPlanMap.get(materialId) || 0) - warehouseStock;
        if (materialId === "P1") {
          console.log(`Warhousestock ${warehouseStock} calculated productionRequirement ${productionPlanMap.get(materialId) || 0}`);
        }
        if (requirement > 0) {
          manufacturingPlan.set(
            materialId,
            requirement
          );
        }
      }
    } catch (error) {
      console.error("Error fetching production plan:", error);
      alert("Error fetching production plan. Please try again.");
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