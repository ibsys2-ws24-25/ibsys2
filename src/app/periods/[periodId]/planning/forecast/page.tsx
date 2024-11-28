'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { ForecastTable } from "@/components/pages/forecast/forecastTable";
import { ProductionTable } from "@/components/pages/forecast/productionPlan";
import { Button } from "@/components/ui/button"
import { Prisma } from '@prisma/client';

type DataWithAmounts = {
  product: string;
  amounts: number[];
};

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

export default function HomePage({ params }: { params: { periodId: number } }) {
  const [forecastData, setForecastData] = useState<DataWithAmounts[]>([]);
  const [productionData, setProductionData] = useState<DataWithAmounts[]>([
      { product: "P1: Children's bicycle", amounts: [150, 250, 250, 200] },
      { product: "P2: Ladies bicycle", amounts: [200, 150, 150, 100] },
      { product: "P3: Men's bicycle", amounts: [150, 100, 100, 100] }
  ]);
  const [plannedStocks, setPlannedStocks] = useState<DataWithAmounts[]>([]);

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

  useEffect(() => {
    async function fetchForecastData() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${params.periodId}`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch period data');
            return;
        }
        const data: PeriodWithRelations = await response.json();
        const formattedData = data.Forecast.map(f => ({
            product: f.Material.id + ": " + f.Material.name,
            amounts: [f.amount, 0, 0, 0]
        }));
        setForecastData(formattedData);
        calculatePlannedStocks(formattedData, productionData); // Initial calculation
    }

    fetchForecastData();
  }, [params.periodId, calculatePlannedStocks, productionData]);


  const handleForecastDataChange = useCallback((newData: DataWithAmounts[]) => {
    setForecastData(newData);
    calculatePlannedStocks(newData, productionData);
  }, [calculatePlannedStocks, productionData]);

  const handleProductionDataChange = useCallback((newData: DataWithAmounts[]) => {
    setProductionData(newData);
    calculatePlannedStocks(forecastData, newData);
  }, [calculatePlannedStocks, forecastData]);

  const saveProductionData = useCallback(async () => {
    const anyNegative = plannedStocks.some(item => item.amounts.some(amount => amount < 0));
    if (anyNegative) {
      alert("Cannot save: One or more planned stocks are below zero.");
      return;
    }

    plannedStocks.forEach(async (item) => {
      const materialId = item.product.split(':')[0]; // Extrahieren des Material-IDs
      item.amounts.forEach(async (safetyStock, index) => {
        const periodId = params.periodId; // Die aktuelle Periode aus der URL
        const forPeriod = periodId + index; // Berechnen der Zielperiode basierend auf dem Index
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${periodId.toString()}/production`; // POST-URL
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            materialId,
            productId: item.product,
            safetyStock,
            forPeriod // Hinzufügen der berechneten forPeriod
          }),
        });
  
        if (!response.ok) {
          console.error(`Failed to save production plan data for period ${periodId} targeting forPeriod ${forPeriod}`, response.statusText);
        }
      });
    });
  }, [plannedStocks, params.periodId]);
  
  
  return (
      <div>
          <ForecastTable currentPeriod={params.periodId} data={forecastData} updateData={handleForecastDataChange} />
          <ProductionTable 
            currentPeriod={params.periodId} 
            productionData={productionData} 
            plannedStocks={plannedStocks} 
            handleProductionDataChange={handleProductionDataChange} 
          />
          <Button onClick={saveProductionData}>Save</Button>
      </div>
  );
}