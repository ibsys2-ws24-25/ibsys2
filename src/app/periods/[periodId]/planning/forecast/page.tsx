'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { ForecastTable } from "@/components/pages/forecast/forecastTable";
import { ProductionTable } from "@/components/pages/forecast/productionPlan";

type DataWithAmounts = {
  product: string;
  amounts: number[];
};

export default function HomePage({ params }: { params: { periodId: number } }) {
  const [forecastData, setForecastData] = useState<DataWithAmounts[]>([]);
  const [productionData, setProductionData] = useState<DataWithAmounts[]>([
      { product: "P1 Children's bicycle", amounts: [150, 250, 250, 200] },
      { product: "P2 Ladies bicycle", amounts: [200, 150, 150, 100] },
      { product: "P3 Men's bicycle", amounts: [150, 100, 100, 100] }
  ]);
  const [plannedStocks, setPlannedStocks] = useState<DataWithAmounts[]>([]);

  useEffect(() => {
    async function fetchForecastData() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${params.periodId}`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch period data');
            return;
        }
        const data = await response.json();
        const formattedData = data.Forecast.map(f => ({
            product: f.Material.id + " " + f.Material.name,
            amounts: [parseInt(f.amount), 0, 0, 0]
        }));
        setForecastData(formattedData);
        calculatePlannedStocks(formattedData, productionData); // Initial calculation
    }

    fetchForecastData();
  }, [params.periodId]);

  const calculatePlannedStocks = useCallback((forecast = forecastData, production = productionData) => {
    const newPlannedStocks = production.map(prod => {
        const forecastItem = forecast.find(f => f.product === prod.product);
        return {
            product: prod.product,
            amounts: prod.amounts.map((amount, index) => amount - (forecastItem ? forecastItem.amounts[index] : 0))
        };
    });

    setPlannedStocks(newPlannedStocks);
  }, [forecastData, productionData]);

  const handleForecastDataChange = useCallback((newData: DataWithAmounts[]) => {
    setForecastData(newData);
    calculatePlannedStocks(newData, productionData);
  }, [calculatePlannedStocks, productionData]);

  const handleProductionDataChange = useCallback((newData: DataWithAmounts[]) => {
    setProductionData(newData);
    calculatePlannedStocks(forecastData, newData);
  }, [calculatePlannedStocks, forecastData]);

  return (
      <div>
          <ForecastTable currentPeriod={params.periodId} data={forecastData} updateData={handleForecastDataChange} />
          <ProductionTable 
            currentPeriod={params.periodId} 
            productionData={productionData} 
            plannedStocks={plannedStocks} 
            handleProductionDataChange={handleProductionDataChange} 
          />
      </div>
  );
}