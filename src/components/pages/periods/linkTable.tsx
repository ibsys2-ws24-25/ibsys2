"use client";

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Period } from "@prisma/client";

export interface PeriodTableProps {
    periods: Period[];
}

export default function LinkTable({ periods }: PeriodTableProps) {
    return (
        <div className="overflow-x-auto w-full">
            <Table className="w-full border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Periods</TableHead>
                        <TableHead className="text-center">Production Plan</TableHead>
                        <TableHead className="text-center">Workplace</TableHead>
                        <TableHead className="text-center">Purchase Planning</TableHead>
                        <TableHead className="text-center">Export</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {periods.map((period) => (
                        <TableRow key={period.id} className="border-t">
                            <TableCell>
                                <Link href="" className="text-blue-500 hover:underline">
                                    {period.id}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Button className="bg-primary text-primary-foreground">
                                        <Link href={`/periods/${period.id}/production-planning/1`}>Plan Production</Link>
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Button className="bg-primary text-primary-foreground">
                                        <Link href="">PLAN</Link>
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Button className="bg-primary text-primary-foreground">
                                        <Link href="">PLAN</Link>
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Button className="bg-primary text-primary-foreground">
                                        <Link href="">PLAN</Link>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
