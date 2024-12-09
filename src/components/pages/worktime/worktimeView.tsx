"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type WorkplaceData = {
    id: number;
    capacity: number;
    overtime: number;
    shifts: number;
};

type WorktimeViewProps = {
    periodId: number;
};

export default function WorktimeView({ periodId }: WorktimeViewProps) {
    const [workplaceData, setWorkplaceData] = useState<WorkplaceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(`/api/period/${periodId}/worktime`);
                if (!response.ok) throw new Error("Failed to fetch workplace data.");

                const data: WorkplaceData[] = await response.json();
                setWorkplaceData(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [periodId]);

    const headers = Array.from({ length: 15 }, (_, i) => i + 1);

    return (
        <div className="overflow-x-auto">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Workplaces</TableHead>
                            {headers.map((number) => (
                                <TableHead key={number}>{number}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Total capacity requirements</TableCell>
                            {Array.isArray(workplaceData) ? (
                                workplaceData.map((workplace) => (
                                    <TableCell key={workplace.id}>{workplace.capacity}</TableCell>
                                ))
                            ) : (
                                <TableCell>No workplace data available</TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            <TableCell>Overtime</TableCell>
                            {workplaceData.map((workplace) => (
                                <TableCell key={workplace.id}>{workplace.overtime}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell>Shift</TableCell>
                            {workplaceData.map((workplace) => (
                                <TableCell key={workplace.id}>{workplace.shifts}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            )}
        </div>
    );
}