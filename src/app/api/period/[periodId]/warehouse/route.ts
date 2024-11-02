import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const warehouse = await prisma.warehouse.findMany({
        
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    return NextResponse.json({ error: "Error fetching warehouse" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
    const prisma = new PrismaClient();

    try {
        const {
            periodId,
            materialId,
            amount,
        } = await request.json();

        if (!(periodId && materialId && amount)) {
            return NextResponse.json({ error: "periodId && materialId && amount is required" }, { status: 400 });
        }

        const newWarehouseEntry = await prisma.warehouse.create({
            data: {
                periodId: parseInt(periodId),
                materialId: materialId,
                amount: parseInt(amount),
            },
        });

        return NextResponse.json(newWarehouseEntry, { status: 201 });
    } catch (error) {
        console.error("Error creating period:", error);
        return NextResponse.json({ error: "Error creating period" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}