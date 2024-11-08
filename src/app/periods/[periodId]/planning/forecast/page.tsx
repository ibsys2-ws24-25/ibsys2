'use client'

import { ForecastTable } from "@/components/pages/forecast/forecastTable"

export default async function HomePage({ params }: { params: { periodId: number}}){
    return(
        <ForecastTable currentPeriod={params.periodId} />
    )
}