"use client";
import { Prisma } from "@prisma/client";
import { Chart } from "react-google-charts";

type WarehouseWithRelations = Prisma.WarehouseGetPayload<{
    include: {
        Material: true,
    };
}>;

export interface WarehouseTableProps {
    warehouseEntries: WarehouseWithRelations[];
}

export default function WarehouseCharts({ warehouseEntries }: WarehouseTableProps) {
    const pieChartData = [
        ["Material ID", "Warehouse Value"],
        ...warehouseEntries.map((entry) => [
            entry.materialId,
            entry.amount * entry.Material.itemValue,
        ]),
    ];

    const barChartData = [
        ["Material ID", "Amount"],
        ...warehouseEntries
            .map((entry): [string, number] => [
                entry.materialId,
                (entry.amount / entry.Material.defaultStock) * 100,
            ])
            .sort((a, b) => b[1] - a[1])
    ];

    return (
        <div className="flex gap-4 w-full mb-4">
            <div className="flex-1">
                <Chart
                    chartType="PieChart"
                    data={pieChartData}
                    width="100%"
                    height="400px"
                    options={{
                        title: "Warehouse by Value",
                    }}
                />
            </div>

            <div className="flex-1">
                <Chart
                    chartType="BarChart"
                    data={barChartData}
                    width="100%"
                    height="400px"
                    options={{
                        title: "Relation to default stock",
                        legend: { position: "none" },
                    }}
                />
            </div>
        </div>
    );
}