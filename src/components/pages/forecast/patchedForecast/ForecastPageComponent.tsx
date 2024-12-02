'use client'
import ForecastForm from "@/components/pages/forecast/patchedForecast/ForecastForm";
import { ForecastProps } from "@/app/periods/[periodId]/planning/forecast/page";
import { ForecastProvider } from "@/context/ForecastContext";

export default function ForecastPage({ periodId, forecasts }: ForecastProps) {
    return(
        <ForecastProvider initialForecasts={forecasts}>
            <ForecastForm periodId={periodId} />
        </ForecastProvider>
    );
}