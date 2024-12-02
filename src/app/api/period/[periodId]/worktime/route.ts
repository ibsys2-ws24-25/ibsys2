import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function calculateTotalCapacity(request: Request, { params }: { params: { periodId: string } }) {
    const periodId = Number(params.periodId);

    try {
        // Fetch the production plan for the given period
        const response = await fetch(`/api/period/${periodId}/manufactoring-plan/`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch production plan.");
        }

        const productionPlan: Record<string, number> = await response.json(); // Example: { "P1": 100, "E10": 200 }

        // Initialize a map to track total capacity for each workplace
        const workplaceCapacityMap: Record<string, number> = {}; // { workplaceId: totalCapacity }

        // Process each material in the production plan
        for (const [materialId, productionQuantity] of Object.entries(productionPlan)) {
            // Fetch material details with procurement time and linked workplaces
            const material = await prisma.material.findUnique({
                where: { id: materialId },
                include: {
                    Workplaces: true, // Include all workplaces linked to this material
                },
            });

            if (!material) {
                console.warn(`Material with ID ${materialId} not found.`);
                continue;
            }

            for (const workplaceMaterial of material.Workplaces) {
                const { workplaceId, procurementTime, setupTime } = workplaceMaterial;

                if (!procurementTime) {
                    console.warn(`No procurement time found for material ${materialId} at workplace ${workplaceId}.`);
                    continue;
                }

                // Calculate total capacity for the workplace
                const materialCapacity = productionQuantity * procurementTime + (setupTime || 0);

                // Add this material's capacity to the total for the workplace
                workplaceCapacityMap[workplaceId] = (workplaceCapacityMap[workplaceId] || 0) + materialCapacity;
            }
        }

        // Return the total capacity map as a JSON response
        return NextResponse.json(workplaceCapacityMap);
    } catch (error) {
        console.error("Error calculating total capacity:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}