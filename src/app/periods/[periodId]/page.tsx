import CreateWarehouseStock from "@/components/pages/periods/view/CreateWarehouseStock";
import { Prisma } from "@prisma/client";

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
            <h1 className="text-2xl font-bold mb-8 text-primary">
                Overview of Period {params.periodId}
            </h1>
            
            {/* Row with h2 and Button */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">
                    Warehouse Value: {warehouseValue}$
                </h2>
                <CreateWarehouseStock periodId={params.periodId} />
            </div>
            
        </div>
    );
}