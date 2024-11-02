"use client";

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { Button } from '@/components/ui/button';

const periodData = [
    { period: "Period 1", link: "/periods/1/production-planning/1" },
    { period: "Period 2", link: "/periods/2/production-planning/1" },
    { period: "Period 3", link: "/periods/3/production-planning/1" +
            "" },
];

export default function LinkTable() {
    return (
        <div className="overflow-x-auto">
            <Table className="min-w-full border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Periods</TableHead>
                        <TableHead>Production Plan</TableHead>
                        <TableHead>ProductP1</TableHead>
                        <TableHead>ProductP2</TableHead>
                        <TableHead>ProductP3</TableHead>
                        <TableHead>Workplace</TableHead>
                        <TableHead>Purchase Planning</TableHead>
                        <TableHead>Export</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {periodData.map((period, index) => (
                        <TableRow key={index} className="border-t">
                            <TableCell>
                                <Link href={period.link} className="text-blue-500 hover:underline">
                                    {period.period}
                                </Link>
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
