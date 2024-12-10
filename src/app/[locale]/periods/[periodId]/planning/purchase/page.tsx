import PurchaseTable from "@/components/pages/purchase/purchaseTable";
import { getPurchaseParts } from "@/lib/prodUtils";
import { Prisma, PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { MaterialRequirement } from "@/app/api/period/[periodId]/material/route";

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

async function getMaterialRequirements(periodId: number): Promise<MaterialRequirement[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${periodId}/material`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        console.error('Failed to fetch material requirements');
        return [];
    }
    return response.json();
}

export default async function PurchasePartPage({ params }: { params: { periodId: number }}) {
    const period = await getPeriod(params.periodId);
    const purchaseParts = getPurchaseParts(period.Warehouse);
    const prisma = new PrismaClient();
    const orders = await prisma.order.findMany({
        where: {
            periodId: Number(params.periodId),
        }
    })
    const orderDecisions = await prisma.orderDecision.findMany({
        where: {
            periodId: Number(params.periodId)
        }
    })
    const materialRequirements = await getMaterialRequirements(params.periodId);

    return (
        <div>
            <PurchaseTable orders={ orders } purchaseParts={ purchaseParts } periodId={params.periodId} orderDecisions={ orderDecisions } requiredMaterials={ materialRequirements }/>
        </div>
    );
}