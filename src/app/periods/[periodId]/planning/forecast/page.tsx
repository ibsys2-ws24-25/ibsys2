'use client'
import { ForecastTable } from "@/components/pages/forecast/forecastTable";
import { ProductionTable } from "@/components/pages/forecast/productionPlan";

export default function HomePage({ params }: { params: { periodId: number}}) {
    return (
        <div>
            <ForecastTable currentPeriod={params.periodId} />
            
            <ProductionTable currentPeriod={params.periodId} />
        </div>
    );
}
