"use client";

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Prisma, Warehouse } from "@prisma/client";

type WarehouseWithRelations = Prisma.WarehouseGetPayload<{
    include: {
        Material: true,
    };
}>;

export interface WarehouseTableProps {
    warehouseEntries: WarehouseWithRelations[];
}

export default function WarehouseTable({ warehouseEntries }: WarehouseTableProps) {
    return (
        <div className="overflow-x-auto w-full">
            <Table className="w-full border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Material ID</TableHead>
                        <TableHead>Material Name</TableHead>
                        <TableHead>Filled</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouseEntries.map((warehouseEntry) => (
                        <TableRow key={warehouseEntry.id} className="border-t">
                            <TableCell>
                                {warehouseEntry.materialId}
                            </TableCell>
                            <TableCell>
                                {warehouseEntry.Material.name}
                            </TableCell>
                            <TableCell>
                                {
                                    ((warehouseEntry.amount / warehouseEntry.Material.defaultStock) * 100).toFixed(0)
                                }
                                %
                            </TableCell>
                            <TableCell>
                                {warehouseEntry.amount}
                            </TableCell>
                            <TableCell>
                                {
                                    (warehouseEntry.amount * warehouseEntry.Material.itemValue).toFixed(2)
                                }
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Button variant="destructive">
                                        Delete
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
