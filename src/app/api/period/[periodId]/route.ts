import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
  try {
    const period = await prisma.period.findUnique({
      where: {
        id: parseInt(params.periodId),
      },
      include: {
        Warehouse: {
            include: {
                Material: true,
            },
        },
        Forecast: {
            include: {
                Material: true,
            },
        },
      },
    });

    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 });
    }

    return NextResponse.json(period);
  } catch (error) {
    console.error("Error fetching period:", error);
    return NextResponse.json({ error: "Error fetching period" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: { periodId: string } }) {
  try {
    const periodId = parseInt(params.periodId);

    const period = await prisma.period.findUnique({
      where: { id: periodId },
    });

    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 });
    }

    await prisma.period.delete({
      where: { id: periodId },
    });

    return NextResponse.json({ message: "Period deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting period:", error);
    return NextResponse.json({ error: "Error deleting period" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}