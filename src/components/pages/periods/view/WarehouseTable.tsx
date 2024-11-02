"use client";

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Prisma, Warehouse } from "@prisma/client";
import { useState } from "react";

type WarehouseWithRelations = Prisma.WarehouseGetPayload<{
    include: {
        Material: true,
    };
}>;

export interface WarehouseTableProps {
    warehouseEntries: WarehouseWithRelations[];
    periodId: number;
}

export default function WarehouseTable({ warehouseEntries: initialEntries, periodId }: WarehouseTableProps) {
    const [warehouseEntries, setWarehouseEntries] = useState<WarehouseWithRelations[]>(initialEntries);

    const deleteWarehouseEntry = async (warehouseId: number) => {
        const confirmed = confirm("Are you sure you want to delete this entry?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/period/${periodId}/warehouse/${warehouseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete warehouse entry");
            }

            setWarehouseEntries((prevEntries) =>
                prevEntries.filter((entry) => entry.id !== warehouseId)
            );
        } catch (error) {
            console.error("Error deleting warehouse entry:", error);
            alert("Error deleting warehouse entry. Please try again.");
        }
    };

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
                                    <Button
                                        variant="destructive"
                                        onClick={() => deleteWarehouseEntry(warehouseEntry.id)}
                                    >
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