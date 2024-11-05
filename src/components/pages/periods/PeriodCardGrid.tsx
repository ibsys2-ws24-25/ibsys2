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
                    <Card key={period.id} className="shadow-lg p-4">
                        <CardHeader>
                            <CardTitle>Period {period.id}</CardTitle>
                            <CardDescription>{String(period.created)}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <Button variant="default" className="w-full">
                                <Link href={`/periods/${period.id}`}>
                                    View Period
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full mt-1"
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