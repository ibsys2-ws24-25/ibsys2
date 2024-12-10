import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function UPDATE(request: Request, { params }: { params: { periodId: string } }) {
    const currentPeriod = Number(params.periodId);

    try {
        const { productionOrders } = await request.json();
    
        if (!Array.isArray(productionOrders)) {
          return NextResponse.json(
            { error: "Invalid input format. 'productionOrders' must be an array." },
            { status: 400 }
          );
        }
    
        const prioritySet = new Set<number>();
        for (const order of productionOrders) {
          if (prioritySet.has(order.priority)) {
            return NextResponse.json(
              { error: `Duplicate priority detected: ${order.priority}` },
              { status: 400 }
            );
          }
          prioritySet.add(order.priority);
        }
    
        const validMaterials = await prisma.material.findMany({
          where: { id: { in: productionOrders.map((o) => o.materialId) } },
        });
        const validMaterialIds = new Set(validMaterials.map((m) => m.id));
    
        for (const order of productionOrders) {
          if (!validMaterialIds.has(order.materialId)) {
            return NextResponse.json(
              { error: `Invalid materialId: ${order.materialId}` },
              { status: 400 }
            );
          }
        }
    
        await prisma.$transaction(async (tx) => {
          for (const order of productionOrders) {
            const { id, materialId, quantity, priority } = order;
    
            if (!materialId || quantity <= 0 || priority <= 0) {
              throw new Error(`Invalid data for production order: ${JSON.stringify(order)}`);
            }
    
            if (id > 0) {
              await tx.productionListOfWorkplace.update({
                where: { id },
                data: {
                  quantity,
                  priority,
                },
              });
            } else {
              await tx.productionListOfWorkplace.create({
                data: {
                  materialId,
                  quantity,
                  priority,
                  periodId: currentPeriod,
                },
              });
            }
          }
        });
    
        return NextResponse.json({ message: "Production orders updated successfully." });
      } catch (error) {
        console.error("Error updating production orders:", error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Unknown error occurred." },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect();
      }
  }

export async function POST(request: Request, { params }: { params: { periodId: string } }) {
    const periodId = Number(params.periodId);

    try{

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${periodId}/manufactoring-plan/`, {
            method: "GET",
        });
        if (!response.ok) throw new Error("Failed to fetch production plan.");

        const productionPlan: Record<string, number> = await response.json();

        if (!productionPlan || Object.keys(productionPlan).length === 0) {
            throw new Error("Production plan is empty or invalid.");
        }

        const productionEntries = Object.entries(productionPlan).map(([materialId, quantity], index) => ({
            materialId,
            quantity,
            priority: index + 1,
            periodId,
        }));

        await prisma.productionListOfWorkplace.createMany({
            data: productionEntries,
        });

        return NextResponse.json({ message: "Production orders created successfully." });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error creating production order entries:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Unknown creating production order entrie:", error);
            return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
        }
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
    const periodId = Number(params.periodId);

    try {
        const productionOrders = await prisma.productionListOfWorkplace.findMany({
            where: { periodId }
        });

        if (!productionOrders || productionOrders.length === 0) {
            return NextResponse.json(
                { error: "No production orders found for the given period." },
                { status: 404 }
            );
        }

        return NextResponse.json(productionOrders, { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching production orders:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error occurred." },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}