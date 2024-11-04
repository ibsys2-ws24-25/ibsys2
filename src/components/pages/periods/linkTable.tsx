"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Period } from "@prisma/client";

export interface PeriodTableProps {
    periods: Period[];
}

export default function LinkTable({ periods }: PeriodTableProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const deletePeriod = async (id: number) => {
        if (!confirm("Are you sure you want to delete this period?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/period/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete period.");
            }

            // Reload the page or fetch updated data
            router.refresh(); // Reload to update the table after deletion
        } catch (error) {
            console.error("Error deleting period:", error);
            alert("Error deleting period. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

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
                        <TableHead className="text-center">Delete</TableHead>
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
                            <TableCell className="text-center">
                                <Button
                                    variant="destructive"
                                    onClick={() => deletePeriod(period.id)}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};