"use client"

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ProductionPlan } from "@/lib/prodUtils";
import { useCallback, useEffect, useState } from "react";
import { ProductionPlanDecision } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export interface MaterialTableProps {
    productionPlan: ProductionPlan[];
    defaultStockSetting: string;
    periodId: string;
    productId: string;
    decisions: ProductionPlanDecision[];
}

interface SafetyStockInputValue {
    materialId: string;
    value: number;
}

const MaterialTable = ({ productionPlan, defaultStockSetting, periodId, productId, decisions }: MaterialTableProps) => {
    const [isUpdating, setIsUpdating] = useState<boolean>(true);
    const [productionPlanInit, setProductionPlanInit] = useState<boolean>(true);
    const [fetchedProductionPlan, setFetchedProductionPlan] = useState<Map<string, number> | undefined>(undefined);
    const [safetyStockInputValues, setSafetyStockInputValues] = useState<SafetyStockInputValue[]>(
        decisions.map((decision) => ({ materialId: decision.materialId, value: decision.safetyStock }))
    );

    const getSafetyStockValue = (materialId: string): number => {
        const entry = safetyStockInputValues.find((item) => item.materialId === materialId);
        return entry ? entry.value : parseInt(defaultStockSetting, 10);
    };

    const setSafetyStockValue = (materialId: string, newValue: number) => {
        setSafetyStockInputValues((prevValues) => {
            const existingIndex = prevValues.findIndex((item) => item.materialId === materialId);

            if (existingIndex !== -1) {
                const updatedValues = [...prevValues];
                updatedValues[existingIndex] = { ...updatedValues[existingIndex], value: newValue };
                return updatedValues;
            } else {
                return [...prevValues, { materialId, value: newValue }];
            }
        });
    };

    const setDecision = async (materialId: string, safetyStock: number) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/period/${periodId}/production`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    materialId,
                    productId,
                    safetyStock
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to set decision.");
            }
    
        } catch (error) {
            console.error("Error setting decision:", error);
            alert("Error setting decision. Please try again.");
        } finally {
            fetchProductionPlan();
            setIsUpdating(false);
        }
    };

    const getDefaultValue = (materialId: string) => {
        const decision = decisions.find((d) => d.materialId === materialId);
        return decision ? decision.safetyStock : parseInt(defaultStockSetting, 10);
    };

    const fetchProductionPlan = useCallback(async () => {
        try {
            const response = await fetch(`/api/period/${periodId}/manufactoring-plan/`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch production plan.");
            }

            const data = await response.json();

            const productionPlanMap = new Map<string, number>(Object.entries(data));
            setFetchedProductionPlan(productionPlanMap);
        } catch (error) {
            console.error("Error fetching production plan:", error);
            alert("Error fetching production plan. Please try again.");
        }
    }, [periodId]);

    useEffect(() => {
        if (productionPlanInit) {
            fetchProductionPlan();
            setProductionPlanInit(false);
            setIsUpdating(false);
        }
    }, [fetchProductionPlan, productionPlanInit, setProductionPlanInit]);

    return (
        <div className="overflow-x-auto">
            <Table className=" border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Item No.</TableHead>
                        <TableHead>Sales Orders</TableHead>
                        <TableHead>Safety Stock</TableHead>
                        <TableHead>Warehouse Stock</TableHead>
                        <TableHead>Orders in Queue</TableHead>
                        <TableHead>Work in Progress</TableHead>
                        <TableHead>Production Orders</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productionPlan.map((material) => (
                        <TableRow key={material.materialId} className="border-t">
                            <TableCell>
                                {material.materialId}
                            </TableCell>
                            <TableCell>
                                { material.salesPlan }
                            </TableCell>
                            <TableCell>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                className="text-center w-full"
                                disabled={ isUpdating }
                                defaultValue={
                                    getDefaultValue(material.materialId)
                                }
                                value={getSafetyStockValue(material.materialId)}
                                onBlur={(e) => {
                                    setDecision(material.materialId, Number(e.target.value));
                                }}
                                onChange={(e) => {
                                    setSafetyStockValue(material.materialId, Number(e.target.value));
                                }}
                            />
                            </TableCell>
                            <TableCell>
                                {material.warehouseStock}
                            </TableCell>
                            <TableCell>
                                {material.queueOrders}
                            </TableCell>
                            <TableCell>
                                {material.workInProgress}
                            </TableCell>
                            <TableCell>
                                {
                                    isUpdating ? (
                                        <Skeleton className="w-[50px] h-[20px]" />
                                    ) :
                                    fetchedProductionPlan?.has(material.materialId) ? fetchedProductionPlan.get(material.materialId) : 0
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MaterialTable;