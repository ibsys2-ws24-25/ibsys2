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
      { product: "P3 Männerrad", amounts: [150, 100, 100, 100] }
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
    }

    fetchForecastData();
  }, [params.periodId]);

  const calculatePlannedStocks = useCallback(() => {
    const newPlannedStocks = productionData.map(prod => {
        const forecast = forecastData.find(f => f.product === prod.product);
        return {
            product: prod.product,
            amounts: prod.amounts.map((amount, index) => amount - (forecast ? forecast.amounts[index] : 0))
        };
    });

    console.log("Forecast Data:", forecastData); // Debugging
    console.log("Production Data:", productionData); // Debugging
    console.log("Calculated Planned Stocks:", newPlannedStocks); // Debugging

    setPlannedStocks(newPlannedStocks);
  }, [forecastData, productionData]);

  const handleProductionDataChange = useCallback((newData: DataWithAmounts[]) => {
    console.log("Updated Production Data:", newData); // Debugging
    setProductionData(newData);
    calculatePlannedStocks();
  }, [calculatePlannedStocks]);

  return (
      <div>
          <ForecastTable currentPeriod={params.periodId} data={forecastData} updateData={setForecastData} />
          <ProductionTable 
            currentPeriod={params.periodId} 
            productionData={productionData} 
            plannedStocks={plannedStocks} 
            handleProductionDataChange={handleProductionDataChange} 
          />
      </div>
  );
}