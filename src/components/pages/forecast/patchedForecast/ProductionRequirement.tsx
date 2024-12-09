'use client';

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForecastContext } from '@/context/ForecastContext';
import { getAdditionalSaleObjectByProductAndPeriod, getDecisionObjectByProductAndPeriod, getForecastObjectByProductAndPeriod, getWarehouseStock } from '@/lib/forecastUtils';
import { Warehouse } from '@prisma/client';

export default function ProductionRequirement({ periodId, warehouse }: { periodId: number, warehouse: Warehouse[] }) {
    const { localProdDecisions, localForecasts, localAdditionalSales } = useForecastContext();

    return (
        <Table>
            <TableCaption>This will be the production Plan for Period {periodId}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[130px]">Product</TableHead>
                    <TableHead>Period {periodId}</TableHead>
                    <TableHead>Period {periodId + 1}</TableHead>
                    <TableHead>Period {periodId + 2}</TableHead>
                    <TableHead>Period {periodId + 3}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {['P1', 'P2', 'P3'].map((productId) => (
                    <TableRow key={productId}>
                        <TableCell className="font-medium">{productId}</TableCell>
                        {[0, 1, 2, 3].map((offset) => {
                            const period = periodId + offset;

                            const initialWarehouseStock = getWarehouseStock(warehouse, productId)?.amount || 0;

                            const forecast = getForecastObjectByProductAndPeriod(localForecasts, productId, period)?.amount || 0;
                            const safetyStock = getDecisionObjectByProductAndPeriod(localProdDecisions, productId, period)?.safetyStock || 0;
                            const additionalSales = getAdditionalSaleObjectByProductAndPeriod(localAdditionalSales, productId, period)?.amount || 0;

                            const warehouseStock =
                                (offset === 0
                                    ? initialWarehouseStock
                                    : getDecisionObjectByProductAndPeriod(localProdDecisions, productId, period - 1)?.safetyStock || 0) - forecast - safetyStock - additionalSales;

                            const productionRequirement = warehouseStock < 1 ? Math.abs(warehouseStock) : 0;

                            return (
                                <TableCell key={period}>
                                    {productionRequirement}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    {[0, 1, 2, 3].map((offset) => {
                        const period = periodId + offset;

                        const totalRequirement = ['P1', 'P2', 'P3'].reduce((sum, productId) => {
                            const initialWarehouseStock = getWarehouseStock(warehouse, productId)?.amount || 0;
                            const forecast = getForecastObjectByProductAndPeriod(localForecasts, productId, period)?.amount || 0;
                            const safetyStock = getDecisionObjectByProductAndPeriod(localProdDecisions, productId, period)?.safetyStock || 0;
                            const additionalSales = getAdditionalSaleObjectByProductAndPeriod(localAdditionalSales, productId, period)?.amount || 0;

                            const warehouseStock =
                                (offset === 0
                                    ? initialWarehouseStock
                                    : getDecisionObjectByProductAndPeriod(localProdDecisions, productId, period - 1)?.safetyStock || 0) - forecast - safetyStock - additionalSales;

                            const productionRequirement = warehouseStock < 1 ? Math.abs(warehouseStock) : 0;

                            return sum + productionRequirement;
                        }, 0);

                        return (
                            <TableCell key={period} className="font-bold">
                                {totalRequirement}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableFooter>
        </Table>
    );
}