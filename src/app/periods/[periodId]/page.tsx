import CreateWarehouseStock from "@/components/pages/periods/view/CreateWarehouseStock";
import WarehouseChart from "@/components/pages/periods/view/WarehouseChart";
import WarehouseTable from "@/components/pages/periods/view/WarehouseTable";
import { Prisma } from '@prisma/client';
import { Metadata } from "next";

async function getPeriod(id: number) {
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

export const metadata: Metadata = {
    title: 'Period overview',
};

export default async function PeriodViewPage({ params }: { params: { periodId: number } }) {
    const period: PeriodWithRelations = await getPeriod(Number(params.periodId));

    const warehouseValue = parseFloat(
        period.Warehouse.reduce((sum, warehouse) => {
            const materialValue = warehouse.Material.itemValue;
            return sum + warehouse.amount * materialValue;
        }, 0).toFixed(2)
    );

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-primary">
                Overview of Period {params.periodId}
            </h1>
            
            <h2 className="text-3xl text-primary">Before planning</h2>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-light text-primary">
                    Warehouse Value: {warehouseValue}$
                </h3>
                <CreateWarehouseStock periodId={params.periodId} />
            </div>
            <WarehouseChart warehouseEntries={period.Warehouse} />
            <WarehouseTable warehouseEntries={period.Warehouse} periodId={params.periodId} />
        </div>
    );
}