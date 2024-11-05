import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
  try {
    const productionDescicions = await prisma.productionPlanDecision.findMany({
      where: {
        periodId: Number(params.periodId),
      },
    });

    return NextResponse.json(productionDescicions);
  } catch (error) {
    console.error("Error fetching productionPlanDecision:", error);
    return NextResponse.json({ error: "Error fetching productionPlanDecision" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request, { params }: { params: { periodId: string } }) {
  try {
    const { materialId, productId, safetyStock } = await request.json();

    let decision = await prisma.productionPlanDecision.findUnique({
      where: {
        periodId_materialId_productId: {
          periodId: Number(params.periodId),
          materialId,
          productId,
        },
      },
    });

    if (decision) {
      decision = await prisma.productionPlanDecision.update({
        where: {
            periodId_materialId_productId: {
                periodId: Number(params.periodId),
                materialId,
                productId,
            },
        },
        data: {
          safetyStock,
        },
      });
    } else {
      decision = await prisma.productionPlanDecision.create({
        data: {
          periodId: Number(params.periodId),
          materialId,
          safetyStock,
          productId
        },
      });
    }

    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    console.error("Error creating or updating period decision:", error);
    return NextResponse.json({ error: "Error creating or updating period decision" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}