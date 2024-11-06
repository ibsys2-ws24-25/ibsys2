import { ForecastTable } from "@/components/pages/forecast/forecastTable";
import { ProductionTable } from "@/components/pages/forecast/productionPlan";
import { notFound } from "next/navigation";
import { Prisma, ProductionPlanDecision, Setting } from '@prisma/client';

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
export default async function HomePage(){
    return(
        <div className="m-10">
            <ForecastTable/>
            <ProductionTable />
        </div>
    )
}