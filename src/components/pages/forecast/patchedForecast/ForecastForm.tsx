'use client';
import { ForecastProps } from "@/app/periods/[periodId]/planning/forecast/page";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getForecastObjectByProductAndPeriod } from "@/lib/forecastUtils";
import { Forecast } from "@prisma/client";
import { useState } from "react";

export default function ForecastForm ({ periodId, forecasts }: ForecastProps) {
    const [localForecasts, setLocalForecasts] = useState<Forecast[]>(forecasts);
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

    const updateApiForecast = async (forPeriodId: number, productId: string) => {
        setIsUpdating(true);
        const amount = getForecastObjectByProductAndPeriod(localForecasts, productId, forPeriodId)?.amount;
    
        if (periodId && amount && amount > 0) {
            try {
                const response = await fetch(`/api/period/${periodId}/forecast`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        forPeriod: forPeriodId,
                        materialId: productId,
                        amount: amount,
                    }),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to update forecast:", errorData.error || response.statusText);
                    setIsUpdating(false);
                } else {
                    const updatedForecast = await response.json();
                    console.log("Forecast updated successfully:", updatedForecast);
                    setIsUpdating(false);
                }
            } catch (error) {
                console.error("Error while sending the request to update forecast:", error);
                setIsUpdating(false);
            }
        } else {
            console.warn("Invalid data: periodId, amount, or amount <= 0");
            setIsUpdating(false);
        }
    };

    return (
        <Table>
            <TableCaption>The current Forecast for Period { periodId }</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[130px]">Product</TableHead>
                    <TableHead>Period { periodId }</TableHead>
                    <TableHead>Period { periodId + 1 }</TableHead>
                    <TableHead>Period { periodId + 2 }</TableHead>
                    <TableHead>Period { periodId + 3 }</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">P1</TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P1", periodId)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId, "P1", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId, "P1")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 1)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 1, "P1", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 1, "P1")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 2)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 2, "P1", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 2, "P1")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P1", periodId + 3)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 3, "P1", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 3, "P1")
                                }
                            }
                        />
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="font-medium">P2</TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId, "P2", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId, "P2")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 1)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 1, "P2", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 1, "P2")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 2)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 2, "P2", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 2, "P2")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 3)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 3, "P2", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 3, "P2")
                                }
                            }
                        />
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="font-medium">P3</TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId, "P3", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId, "P3")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 1)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 1, "P3", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 1, "P3")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={ isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 2)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 2, "P3", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 2, "P3")
                                }
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled= { isUpdating }
                            value={
                                getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 3)?.amount
                            }
                            onChange={
                                (e) => {
                                    updateLocalForecast(periodId + 3, "P3", parseInt(e.target.value));
                                }
                            }
                            onBlur={
                                () => {
                                    updateApiForecast(periodId + 3, "P3")
                                }
                            }
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-bold">Total in Period</TableCell>
                    <TableCell className="font-bold">
                        {
                            (getForecastObjectByProductAndPeriod(localForecasts, "P1", periodId)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId)?.amount || 0)
                        }
                    </TableCell>
                    <TableCell className="font-bold">
                        {
                            (getForecastObjectByProductAndPeriod(localForecasts, "P1", periodId + 1)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 1)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 1)?.amount || 0)
                        }
                    </TableCell>
                    <TableCell className="font-bold">
                        {
                            (getForecastObjectByProductAndPeriod(localForecasts, "P1", periodId + 2)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 2)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 2)?.amount || 0)
                        }
                    </TableCell>
                    <TableCell className="font-bold">
                        {
                            (getForecastObjectByProductAndPeriod(localForecasts, "P1", periodId + 3)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P2", periodId + 3)?.amount || 0) +
                            (getForecastObjectByProductAndPeriod(localForecasts, "P3", periodId + 3)?.amount || 0)
                        }
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
