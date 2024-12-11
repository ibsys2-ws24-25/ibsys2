'use client';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForecastContext } from '@/context/ForecastContext';
import { getAdditionalSaleObjectByProductAndPeriod } from '@/lib/forecastUtils';

export default function AdditionalSaleForm({ periodId }: { periodId: number }) {
    const { localAdditionalSales, isUpdating, updateLocalAdditionalSales, updateApiAdditionalSale } = useForecastContext();

    return (
        <Table>
            <TableCaption>The current Forecast for Period {periodId}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[130px]">Product</TableHead>
                    <TableHead>Period {periodId + 1}</TableHead>
                    <TableHead>Period {periodId + 2}</TableHead>
                    <TableHead>Period {periodId + 3}</TableHead>
                    <TableHead>Period {periodId + 4}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {['P1', 'P2', 'P3'].map((productId) => (
                    <TableRow key={productId}>
                        <TableCell className="font-medium">{productId}</TableCell>
                        {[0, 1, 2, 3].map((offset) => {
                            const period = periodId + offset;
                            return (
                                <TableCell key={period}>
                                    <Input
                                        type="number"
                                        min={0}
                                        step={1}
                                        disabled={isUpdating}
                                        value={getAdditionalSaleObjectByProductAndPeriod(localAdditionalSales, productId, period)?.amount || 0}
                                        onChange={(e) => updateLocalAdditionalSales(period, productId, parseInt(e.target.value))}
                                        onBlur={() => updateApiAdditionalSale(periodId, period, productId)}
                                    />
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-bold">Total in Period</TableCell>
                    {[0, 1, 2, 3].map((offset) => {
                        const period = periodId + offset;
                        const total = ['P1', 'P2', 'P3'].reduce(
                            (sum, productId) => sum + (getAdditionalSaleObjectByProductAndPeriod(localAdditionalSales, productId, period)?.amount || 0),
                            0
                        );
                        return (
                            <TableCell key={period} className="font-bold">
                                {total}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableFooter>
        </Table>
    );
}