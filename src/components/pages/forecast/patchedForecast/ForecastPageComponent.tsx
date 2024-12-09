'use client'
import ForecastForm from "@/components/pages/forecast/patchedForecast/ForecastForm";
import { ForecastProps } from "@/app/periods/[periodId]/planning/forecast/page";
import { ForecastProvider } from "@/context/ForecastContext";
import ProductSafetyStock from "@/components/pages/forecast/patchedForecast/ProductSafetyStock";
import ProductionRequirement from "@/components/pages/forecast/patchedForecast/ProductionRequirement";
import AdditionalSaleForm from "@/components/pages/forecast/patchedForecast/AdditionalSaleForm";

export default function ForecastPage({ periodId, forecasts, prodDecisions, warehouse, additionalSales }: ForecastProps) {
    return(
        <ForecastProvider initialForecasts={forecasts} initialProdDecisions={ prodDecisions } initialAdditionalSales={ additionalSales }>
            <h1 className="font-light text-2xl">Set Forecast values for Period { periodId }</h1>
            <ForecastForm periodId={periodId} />
            <hr className="mt-4 mb-4" />
            <h1 className="font-light text-2xl">Enter your additional sale wishes in Period { periodId }</h1>
            <AdditionalSaleForm periodId={ periodId } />
            <hr className="mt-4 mb-4" />
            <h1 className="font-light text-2xl">Decide which safety Stock you want after Period { periodId }</h1>
            <ProductSafetyStock periodId={ periodId } />
            <hr className="mt-4 mb-4" />
            <h1 className="font-light text-2xl">Production orders for Period { periodId }</h1>
            <ProductionRequirement periodId={ periodId } warehouse={ warehouse } />
        </ForecastProvider>
    );
}