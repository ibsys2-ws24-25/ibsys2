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

//productiinPlanDecision
export async function POST(request: Request, { params }: { params: { periodId: string } }) {
  try {
    const { materialId, productId, safetyStock, forPeriod} = await request.json();
    let forPeriodSet = undefined;
    if (!forPeriod) {
        forPeriodSet = parseInt(params.periodId);
    } else {
        forPeriodSet = forPeriod;
    }
    console.log(`Received data - PeriodID: ${params.periodId}, MaterialID: ${materialId}, ProductID: ${productId}, SafetyStock: ${safetyStock}, ForPeriod: ${forPeriod}`);

    const periodExists = await prisma.period.findUnique({
      where: { id: Number(params.periodId) }
    });

    if (!periodExists) {
      console.error(`Period with ID ${params.periodId} does not exist.`);
      return NextResponse.json({ error: "Period not found" }, { status: 404 });
    }

    let decision = await prisma.productionPlanDecision.findUnique({
      where: {
        periodId_materialId_productId_forPeriod: {
          periodId: Number(params.periodId),
          materialId,
          productId,
          forPeriod: forPeriodSet,
        },
      },
    });

    if (decision) {
      decision = await prisma.productionPlanDecision.update({
        where: {
            periodId_materialId_productId_forPeriod: {
                periodId: Number(params.periodId),
                materialId,
                productId,
                forPeriod: forPeriodSet,
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
          productId,
          forPeriod: forPeriodSet,
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