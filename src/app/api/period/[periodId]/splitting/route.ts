import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {

    const { materialId, quantity, priority, periodId, originalOrderId } = await request.json();

      try {
        const result = await prisma.$transaction(async (prisma) => {
            const originalOrder = await prisma.productionListOfWorkplace.update({
                where: { id: originalOrderId },
                data: {
                    quantity: { decrement: quantity }, // Decrease original quantity
                },
            });

            if (originalOrder.quantity < 0) {
                throw new Error("Split amount exceeds original order quantity.");
            }

            // Create the new split order
            const createdOrder = await prisma.productionListOfWorkplace.create({
                data: {
                    materialId: materialId,
                    quantity: quantity,
                    priority: priority,
                    periodId: periodId,
                },
            });

            // Adjust priorities for subsequent orders
            await prisma.productionListOfWorkplace.updateMany({
                where: {
                    periodId: periodId,
                    priority: { gte: priority }, // All orders with priority >= new split's priority
                    id: { not: createdOrder.id }, // Exclude the newly created order
                },
                data: {
                    priority: { increment: 1 },
                },
            });

            return createdOrder;
        });

        return NextResponse.json({
            message: "Splitted production order created successfully.",
            createdId: result.id,
        });
      } catch (error: unknown) {
          if (error instanceof Error) {
              console.error("Error creating production order entries:", error.message);
              return NextResponse.json({ error: error.message }, { status: 500 });
          } else {
              console.error("Unknown error creating production order entry:", error);
              return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
          }
      } finally {
        await prisma.$disconnect();
      }
}