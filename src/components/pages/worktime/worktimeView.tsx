"use client"

import React, { useCallback, useEffect, useState } from "react";
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

    const fetchCapacityCalculation = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/period/${periodId}/worktime/`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch workplace data.");

            const data: Record<number, { capacity: number; overtime: number; numberOfShifts: number }> = await response.json();

            const workplaceArray = Object.entries(data).map(([id, details]) => ({
                id: Number(id),
                capacity: details.capacity,
                overtime: details.overtime,
                shifts: details.numberOfShifts,
            }));

            return workplaceArray;

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, [periodId]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCapacityCalculation();
            console.log(data)
            setWorkplaceData(data ?? []);
        };

        fetchData();
    }, [fetchCapacityCalculation]);

    const headers = Array.from({ length: 15 }, (_, i) => i + 1).filter((num) => num !== 5);

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
                        {/* Row for Total Capacity Requirements */}
                        <TableRow>
                            <TableCell>Total capacity requirements</TableCell>
                            {workplaceData.map((workplace) => (
                                <TableCell key={workplace.id}>{workplace.capacity}</TableCell>
                            ))}
                        </TableRow>

                        {/* Row for Overtime */}
                        <TableRow>
                            <TableCell>Overtime</TableCell>
                            {workplaceData.map((workplace) => (
                                <TableCell key={workplace.id}>{workplace.overtime}</TableCell>
                            ))}
                        </TableRow>

                        {/* Row for Shifts */}
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

// <TableRow>
//                             <TableCell>Overtime</TableCell>
//                             {workplaceData.map((workplace) => (
//                                 <TableCell key={workplace.id}>{workplace.overtime}</TableCell>
//                             ))}
//                         </TableRow>
//                         <TableRow>
//                             <TableCell>Shift</TableCell>
//                             {workplaceData.map((workplace) => (
//                                 <TableCell key={workplace.id}>{workplace.shifts}</TableCell>
//                             ))}
//                         </TableRow>