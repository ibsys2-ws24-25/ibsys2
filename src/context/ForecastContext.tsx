'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Forecast } from '@prisma/client';
import { getForecastObjectByProductAndPeriod } from '@/lib/forecastUtils';

// Typen für den Context
interface ForecastContextType {
    localForecasts: Forecast[];
    isUpdating: boolean;
    updateLocalForecast: (periodId: number, productId: string, value: number) => void;
    updateApiForecast: (periodId: number, forPeriodId: number, productId: string) => Promise<void>;
    setForecasts: (forecasts: Forecast[]) => void;
}

// Initialer Context-Wert
const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

// Provider-Komponente
export const ForecastProvider = ({
    children,
    initialForecasts,
}: {
    children: ReactNode;
    initialForecasts: Forecast[];
}) => {
    const [localForecasts, setLocalForecasts] = useState<Forecast[]>(initialForecasts);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

    return (
        <ForecastContext.Provider
            value={{
                localForecasts,
                isUpdating,
                updateLocalForecast,
                updateApiForecast,
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