import MaterialTable from '@/components/pages/material/materialTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductionPlan } from '@/lib/prodUtils';
import { Prisma, PrismaClient, ProductionPlanDecision, Setting } from '@prisma/client';
import { notFound } from 'next/navigation';

async function getPeriod(id: number): Promise<PeriodWithRelations> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${id}`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        console.error('Failed to fetch period');
        return notFound();
    }
    return response.json();
}

type PeriodWithRelations = Prisma.PeriodGetPayload<{
    include: {
        Warehouse: {
            include: {
                Material: true,
            },
        },
        Forecast: {
            include: {
                Material: true,
            },
        },
    };
}>;

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

async function fetchMaterials(): Promise<MaterialWithRelations[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/material`, {
        cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Failed to fetch materials');
      return notFound();
    }
    return response.json();
}

async function fetchSetting(name: string): Promise<Setting> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/setting/${name}`, {
        cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch setting');
    }
    return response.json();
}

async function fetchDecisions(periodId: number): Promise<ProductionPlanDecision[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${periodId}/production`, {
        cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Failed to fetch decisions');
      return notFound();
    }
    return response.json();
}

export default async function HomePage({ params }: { params: { periodId: number, productId: number } }) {
    const period = await getPeriod(params.periodId);
    const materials = await fetchMaterials();
    const decisions = await fetchDecisions(params.periodId);

    const productionPlan = getProductionPlan(materials, period.Warehouse, period.Forecast, `P${params.productId}`, Number(params.periodId) + Number(1));

    const defaultStockSetting = await fetchSetting('safety_stock_default');

    const prisma = new PrismaClient();
    
    const waitingQueue = await prisma.waitingQueue.findMany({
      where: { periodId: Number(params.periodId) },
    });

    const forecasts = await prisma.forecast.findMany({
      where: {
        periodId: Number(params.periodId),
        forPeriod: Number(params.periodId),
      }
    });

    await prisma.$disconnect;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Production Plan for Product {params.productId} in Period {params.periodId}</CardTitle>
                <CardDescription>
                    Plan the production for the next period by definining your safety stock.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MaterialTable productionPlan={ productionPlan } defaultStockSetting={ defaultStockSetting.value } periodId={String(params.periodId)} productId={`P${params.productId}`} decisions={decisions} waitingQueue={waitingQueue} forecasts={forecasts} />
            </CardContent>
        </Card>
    );
}
