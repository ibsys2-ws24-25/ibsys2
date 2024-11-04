import MaterialTable from '@/components/pages/material/materialTable';
import { Prisma } from '@prisma/client';

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

export default async function HomePage({ params }: { params: { periodId: number, productId: number } }) {
    const period = await getPeriod(params.periodId);

    console.log(period.Warehouse);

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4 text-primary'>Production Plan for Product {params.productId} in Period {params.periodId}</h1>
            <MaterialTable />
        </div>
    );
}
