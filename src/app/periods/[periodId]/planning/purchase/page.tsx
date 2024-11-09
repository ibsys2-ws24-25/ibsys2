import PurchaseTable from "@/components/pages/purchase/purchaseTable";
import { getPurchaseParts } from "@/lib/prodUtils";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

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

export default async function HomePage({ params }: { params: { periodId: number }}) {
    const period = await getPeriod(params.periodId);
    const purchaseParts = getPurchaseParts(period.Warehouse)

    return (
        <div>
            <PurchaseTable purchaseParts={ purchaseParts }/>
        </div>
    );
}