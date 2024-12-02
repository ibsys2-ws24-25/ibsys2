'use client'
import ForecastForm from "@/components/pages/forecast/patchedForecast/ForecastForm";
import { ForecastProps } from "@/app/periods/[periodId]/planning/forecast/page";
import { ForecastProvider } from "@/context/ForecastContext";
import ProductSafetyStock from "@/components/pages/forecast/patchedForecast/ProductSafetyStock";

export default function ForecastPage({ periodId, forecasts, prodDecisions }: ForecastProps) {
    return(
        <ForecastProvider initialForecasts={forecasts} initialProdDecisions={ prodDecisions }>
            <ForecastForm periodId={periodId} />
            <hr className="mt-4 mb-4" />
            <ProductSafetyStock periodId={periodId} />
        </ForecastProvider>
    );
}