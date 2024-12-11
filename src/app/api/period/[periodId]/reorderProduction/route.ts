import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  
    try {
        const { productionOrders } = await request.json();

        console.log(productionOrders)
    
        if (!Array.isArray(productionOrders)) {
          return NextResponse.json(
            { error: "Invalid input format. 'productionOrders' must be an array." },
            { status: 400 }
          );
        }

        const updatedOrders = productionOrders.map((order, index) => ({
            ...order,
            priority: index + 1,
          }));
    
        await prisma.$transaction(async (tx) => {
          const updatePromises = updatedOrders.map((order) => {
            return tx.productionListOfWorkplace.update({
              where: { id: order.id },
              data: { priority: order.priority },
            });
          });
    
          await Promise.all(updatePromises);
        });
    
        return NextResponse.json({ message: "Priorities updated successfully." });
      } catch (error) {
        console.error("Error updating priorities:", error);
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