import MaterialTable from '@/components/pages/material/materialTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductionPlan } from '@/lib/prodUtils';
import { Prisma, Setting } from '@prisma/client';

async function getPeriod(id: number): Promise<PeriodWithRelations> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${id}`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        console.log(response);
        throw new Error('Failed to fetch period');
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
      throw new Error('Failed to fetch materials');
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

export default async function HomePage({ params }: { params: { periodId: number, productId: number } }) {
    const period = await getPeriod(params.periodId);
    const materials = await fetchMaterials();

    const productionPlan = getProductionPlan(materials, period.Warehouse, period.Forecast, `P${params.productId}`, Number(params.periodId) + Number(1));

    const defaultStockSetting = await fetchSetting('safety_stock_default');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Production Plan for Product {params.productId} in Period {params.periodId}</CardTitle>
                <CardDescription>
                    Plan the production for the next period by definining your safety stock.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MaterialTable productionPlan={ productionPlan } defaultStockSetting={ defaultStockSetting.value } />
            </CardContent>
        </Card>            
    );
}
