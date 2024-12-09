import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MaterialRequirement {
  periodId: number;
  materialId: string;
  amount: number;
}

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
  try {
    const updateMaterialRequirements = (
      materialId: string,
      amount: number,
      periodId: number
    ) => {
      const existingRequirement = requirement.find((item) => item.materialId === materialId && item.periodId === periodId);

      if (existingRequirement) {
        // Wenn ein Eintrag für die MaterialId existiert, summiere den amount auf
        existingRequirement.amount += amount;
      } else {
        // Wenn kein Eintrag existiert, füge ein neues Objekt hinzu
        requirement.push({
          periodId,
          materialId,
          amount,
        });
      }
    };

    const calculateSumKaufteile = (materialId: string, amount: number, periodId: number) => {
      const material = materials.find(mt => (mt.id === materialId));
      if (material && material.MaterialsRequired) {
        for (const part of material.MaterialsRequired) {
          if (part.requiredMaterialId.includes("K")) {
            updateMaterialRequirements(part.requiredMaterialId, amount * part.sum, periodId);
          } else {
            calculateSumKaufteile(part.requiredMaterialId, amount * part.sum, periodId);
          }
        }
      }
    };

    const requirement: MaterialRequirement[] = [];
    const periodId = Number(params.periodId);

    // Fetch materials and forecasts
    const materials = await prisma.material.findMany({
      include: {
        MaterialsRequired: true,
      },
    });

    const forecasts = await prisma.forecast.findMany({
      where: {
        periodId: Number(params.periodId),
        forPeriod: {
          gt: Number(params.periodId),
        },
      }
    });

    for (const forecast of forecasts) {
      calculateSumKaufteile(forecast.materialId, forecast.amount, forecast.forPeriod);
    }

    // Fetch production plan data from another API
    const productionPlanResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${params.periodId}/manufactoring-plan`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!productionPlanResponse.ok) {
      throw new Error(`Failed to fetch production plan: ${productionPlanResponse.statusText}`);
    }

    const productionPlanData: Record<string, number> = await productionPlanResponse.json();

    // Iterate over the productionPlanData keys
    for (const [materialId, amount] of Object.entries(productionPlanData)) {
      const material = materials.find((mt) => mt.id === materialId);

      if (material && material.MaterialsRequired) {
        for (const part of material.MaterialsRequired) {
          if (part.requiredMaterialId.includes("K")) {
            updateMaterialRequirements(
              part.requiredMaterialId,
              part.sum * amount,
              periodId
            );
          }
        }
      }
    }

    return NextResponse.json(requirement, { status: 200 });
  } catch (error) {
    console.error('Error fetching production plan decision:', error);
    return NextResponse.json({ error: 'Error fetching production plan decision' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
