'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdditionalSale, Forecast, ProductionPlanDecision } from '@prisma/client';
import { getAdditionalSaleObjectByProductAndPeriod, getDecisionObjectByProductAndPeriod, getForecastObjectByProductAndPeriod } from '@/lib/forecastUtils';

// Typen für den Context
interface ForecastContextType {
    localForecasts: Forecast[];
    localProdDecisions: ProductionPlanDecision[];
    localAdditionalSales: AdditionalSale[];
    isUpdating: boolean;
    updateLocalForecast: (periodId: number, productId: string, value: number) => void;
    updateLocalDecision: (periodId: number, materialId: string, value: number) => void;
    updateLocalAdditionalSales: (periodId: number, materialId: string, value: number) => void;
    updateApiAdditionalSale: (periodId: number, forPeriodId: number, productId: string) => void;
    updateApiForecast: (periodId: number, forPeriodId: number, productId: string) => Promise<void>;
    updateApiDecision: (periodId: number, forPeriodId: number, materialId: string) => Promise<void>;
    setForecasts: (forecasts: Forecast[]) => void;
}

// Initialer Context-Wert
const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

// Provider-Komponente
export const ForecastProvider = ({
    children,
    initialForecasts,
    initialProdDecisions,
    initialAdditionalSales
}: {
    children: ReactNode;
    initialForecasts: Forecast[];
    initialProdDecisions: ProductionPlanDecision[];
    initialAdditionalSales: AdditionalSale[];
}) => {
    const [localForecasts, setLocalForecasts] = useState<Forecast[]>(initialForecasts);
    const [localProdDecisions, setLocalProdDecisions] = useState<ProductionPlanDecision[]>(initialProdDecisions);
    const [localAdditionalSales, setLocalAdditionalSales] = useState<AdditionalSale[]>(initialAdditionalSales);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const updateLocalAdditionalSales = (periodId: number, materialId: string, value: number) => {
        setLocalAdditionalSales((prevSales) => {
            const saleExists = prevSales.some(
                (sale) => sale.materialId === materialId && sale.forPeriod === periodId
            );
    
            if (saleExists) {
                // Aktualisiere den bestehenden Eintrag
                return prevSales.map((sale) =>
                    sale.materialId === materialId && sale.forPeriod === periodId
                        ? { ...sale, amount: value }
                        : sale
                );
            } else {
                // Füge einen neuen Eintrag hinzu
                const newSale = {
                    id: Math.max(0, ...prevSales.map((s) => s.id)) + 1,
                    periodId,
                    materialId,
                    forPeriod: periodId,
                    amount: value,
                };
    
                return [...prevSales, newSale];
            }
        });
    };

    const updateLocalForecast = (periodId: number, productId: string, value: number) => {
        setLocalForecasts((prevForecasts) => {
            const forecastExists = prevForecasts.some(
                (forecast) => forecast.forPeriod === periodId && forecast.materialId === productId
            );

            if (forecastExists) {
                return prevForecasts.map((forecast) =>
                    forecast.forPeriod === periodId && forecast.materialId === productId
                        ? { ...forecast, amount: value }
                        : forecast
                );
            } else {
                const newForecast = {
                    id: Math.max(0, ...prevForecasts.map((f) => f.id)) + 1,
                    periodId,
                    materialId: productId,
                    forPeriod: periodId,
                    amount: value,
                };

                return [...prevForecasts, newForecast];
            }
        });
    };

    const updateLocalDecision = (periodId: number, materialId: string, value: number) => {
        setLocalProdDecisions((prevDecisions) => {
            const decisionExists = prevDecisions.some(
                (decision) =>
                    decision.periodId === periodId &&
                    decision.productId === materialId &&
                    decision.materialId === materialId
            );
    
            if (decisionExists) {
                // Aktualisiere vorhandene Entscheidung
                return prevDecisions.map((decision) =>
                    decision.periodId === periodId &&
                    decision.materialId === materialId &&
                    decision.materialId === materialId
                        ? { ...decision, safetyStock: value }
                        : decision
                );
            } else {
                const newDecision = {
                    id: Math.max(0, ...prevDecisions.map((d) => d.id)) + 1,
                    periodId,
                    materialId,
                    productId: materialId,
                    forPeriod: periodId,
                    safetyStock: value,
                };
    
                return [...prevDecisions, newDecision];
            }
        });
    };

    const updateApiAdditionalSale = async (periodId: number, forPeriodId: number, productId: string) => {
        setIsUpdating(true);
        const amount = getAdditionalSaleObjectByProductAndPeriod(localAdditionalSales, productId, forPeriodId)?.amount;

        if (amount && amount > 0) {
            try {
                const response = await fetch(`/api/period/${periodId}/additional-sale`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        forPeriod: forPeriodId,
                        materialId: productId,
                        amount: amount,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to update additional sale:', errorData.error || response.statusText);
                } else {
                    const additionalSale = await response.json();
                    console.log('Additional sale updated successfully:', additionalSale);
                }
            } catch (error) {
                console.error('Error while sending the request to update Additional sale:', error);
            } finally {
                setIsUpdating(false);
            }
        } else {
            console.warn('Invalid data: periodId, amount, or amount <= 0');
            setIsUpdating(false);
        }
    };

    const updateApiForecast = async (periodId: number, forPeriodId: number, productId: string) => {
        setIsUpdating(true);
        const amount = getForecastObjectByProductAndPeriod(localForecasts, productId, forPeriodId)?.amount;

        if (amount && amount > 0) {
            try {
                const response = await fetch(`/api/period/${periodId}/forecast`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        forPeriod: forPeriodId,
                        materialId: productId,
                        amount: amount,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to update forecast:', errorData.error || response.statusText);
                } else {
                    const updatedForecast = await response.json();
                    console.log('Forecast updated successfully:', updatedForecast);
                }
            } catch (error) {
                console.error('Error while sending the request to update forecast:', error);
            } finally {
                setIsUpdating(false);
            }
        } else {
            console.warn('Invalid data: periodId, amount, or amount <= 0');
            setIsUpdating(false);
        }
    };

    const updateApiDecision = async (
        periodId: number,
        forPeriodId: number,
        materialId: string,
    ) => {
        setIsUpdating(true);
        const safetyStock = getDecisionObjectByProductAndPeriod(localProdDecisions, materialId, forPeriodId)?.safetyStock;
    
        if (safetyStock && safetyStock > 0) {
            try {
                const response = await fetch(`/api/period/${periodId}/production`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        materialId,
                        productId: materialId,
                        safetyStock,
                        forPeriod: forPeriodId,
                    }),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to update decision:', errorData.error || response.statusText);
                } else {
                    const updatedDecision = await response.json();
                    console.log('Decision updated successfully:', updatedDecision);
                }
            } catch (error) {
                console.error('Error while sending the request to update decision:', error);
            } finally {
                setIsUpdating(false);
            }
        } else {
            console.warn('Invalid data: safetyStock must be greater than 0');
            setIsUpdating(false);
        }
    };

    return (
        <ForecastContext.Provider
            value={{
                localForecasts,
                localProdDecisions,
                localAdditionalSales,
                isUpdating,
                updateLocalAdditionalSales,
                updateLocalForecast,
                updateLocalDecision,
                updateApiAdditionalSale,
                updateApiForecast,
                updateApiDecision,
                setForecasts: setLocalForecasts,
            }}
        >
            {children}
        </ForecastContext.Provider>
    );
};

// Custom Hook
export const useForecastContext = (): ForecastContextType => {
    const context = useContext(ForecastContext);
    if (!context) {
        throw new Error('useForecastContext must be used within a ForecastProvider');
    }
    return context;
};