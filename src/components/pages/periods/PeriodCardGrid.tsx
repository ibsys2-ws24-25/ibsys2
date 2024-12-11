"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Period } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export interface PeriodTableProps {
    periods: Period[];
}

export default function PeriodCardGrid({ periods }: PeriodTableProps) {
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
            router.refresh();
        } catch (error) {
            console.error("Error deleting period:", error);
            alert("Error deleting period. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-4">
            {
                periods.map((period) => (
                    <Card key={period.id} className="p-2">
                        <CardHeader>
                            <CardTitle>Period {period.id}</CardTitle>
                            <CardDescription>{String(period.created)}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <Link href={`/periods/${period.id}`}>
                                <Button variant="default" className="w-full">
                                    View Period
                                
                                </Button>
                            </Link>
                            <Link href={`/periods/${period.id}/planning/forecast`}>
                                <Button variant="outline" className="w-full mt-2">
                                
                                    Forecasts
                                </Button>
                            </Link>
                            <Link href={`/periods/${period.id}/planning/production/1`}>
                                <Button variant="outline" className="w-full mt-2">
                                    Plan Production P1
                                </Button>
                            </Link>
                            <Link href={`/periods/${period.id}/planning/production/2`}>
                                <Button variant="outline" className="w-full mt-1">
                                    Plan Production P2
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full mt-1">
                                <Link href={`/periods/${period.id}/planning/production/3`}>
                                    Plan Production P3
                                </Link>
                            </Button>
                            <Link href={`/periods/${period.id}/planning/worktime`}>
                                <Button variant="outline" className="w-full mt-2">
                                    Plan Worktime
                                </Button>
                            </Link>
                            <Link href={`/periods/${period.id}/planning/reorderProduction`}>
                                <Button variant="outline" className="w-full mt-2">
                                    Reorder Production Orders
                                </Button>
                            </Link>
                            <Link href={`/periods/${period.id}/planning/purchase`}>
                                <Button variant="outline" className="w-full mt-1">
                                    Purchase Parts
                                </Button>
                            </Link>
                            <Link href={`/api/period/${period.id}/input.xml`} target="_blank">
                                <Button className="w-full mt-2">
                                    Download Input File
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                className="w-full mt-4"
                                onClick={() => deletePeriod(period.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Period"}
                            </Button>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    );
};