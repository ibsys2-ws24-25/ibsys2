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

export default function ForecastForm ({ periodId, forecasts }: ForecastProps) {
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
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P1", periodId)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P1", periodId + 1)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P1", periodId + 2)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P1", periodId + 3)?.amount
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
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P2", periodId)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P2", periodId + 1)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P2", periodId + 2)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P2", periodId + 3)?.amount
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
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P3", periodId)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P3", periodId + 1)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P3", periodId + 2)?.amount
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={0}
                            step={1}
                            defaultValue={
                                getForecastObjectByProductAndPeriod(forecasts, "P3", periodId + 3)?.amount
                            }
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-bold">Total in Period</TableCell>
                    <TableCell className="font-bold"></TableCell>
                    <TableCell className="font-bold"></TableCell>
                    <TableCell className="font-bold"></TableCell>
                    <TableCell className="font-bold"></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
