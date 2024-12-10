"use client"

import React, { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type WorkplaceData = {
    name: string;
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

            const data: Record<string, { capacity: number; overtime: number; numberOfShifts: number }> = await response.json();

            const formattedData = Object.entries(data).map(([name, details]) => ({
                name,
                capacity: details.capacity,
                overtime: details.overtime,
                shifts: details.numberOfShifts,
            }));

            return formattedData;

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

    const headers = workplaceData.map((workplace) => workplace.name).sort((a, b) => Number(a) - Number(b));

    const workplaceMap = workplaceData.reduce((acc, workplace) => {
        acc[workplace.name] = workplace;
        return acc;
    }, {} as Record<string, WorkplaceData>);

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
                            {headers.map((name) => (
                                <TableHead key={name}>{name}</TableHead>
                        ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Row for Total Capacity Requirements */}
                        <TableRow>
                            <TableCell>Total capacity requirements</TableCell>
                            {headers.map((name) => (
                                <TableCell key={name}>{workplaceMap[name]?.capacity || 0}</TableCell>
                            ))}
                        </TableRow>

                        <TableRow>
                            <TableCell>Overtime</TableCell>
                            {headers.map((name) => (
                                <TableCell key={name}>{workplaceMap[name]?.overtime || 0}</TableCell>
                            ))}
                        </TableRow>

                        <TableRow>
                            <TableCell>Shift</TableCell>
                            {headers.map((name) => (
                                <TableCell key={name}>{workplaceMap[name]?.shifts || 0}</TableCell>
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