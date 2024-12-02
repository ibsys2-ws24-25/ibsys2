'use client';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForecastContext } from '@/context/ForecastContext';
import { getDecisionObjectByProductAndPeriod } from '@/lib/forecastUtils';

export default function ProductSafetyStock({ periodId }: { periodId: number }) {
    const { localProdDecisions, isUpdating, updateLocalDecision } = useForecastContext();

    return (
        <Table>
            <TableCaption>Decide how much safety stock you want to have after each period</TableCaption>
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
                            return (
                                <TableCell key={period}>
                                    <Input
                                        type="number"
                                        min={0}
                                        step={1}
                                        disabled={isUpdating}
                                        value={getDecisionObjectByProductAndPeriod(localProdDecisions, productId, period)?.safetyStock || 0}
                                        onChange={(e) => updateLocalDecision(period, productId, parseInt(e.target.value))}
                                        // onBlur={() => updateApiForecast(periodId, period, productId)}
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
                            (sum, productId) => sum + (getDecisionObjectByProductAndPeriod(localProdDecisions, productId, period)?.safetyStock || 0),
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