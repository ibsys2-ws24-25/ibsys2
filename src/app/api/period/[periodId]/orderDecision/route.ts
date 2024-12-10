import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { periodId: string } }) {
    try {
      const { materialId, amount, orderPeriod, mode} = await request.json();
  
      console.log(`Received data - PeriodID: ${params.periodId}, MaterialID: ${materialId}, Mode: ${mode}, Amount: ${amount}, OrderPeriod: ${orderPeriod}`);
  
      const periodExists = await prisma.period.findUnique({
        where: { id: Number(params.periodId) }
      });
  
      if (!periodExists) {
        console.error(`Period with ID ${params.periodId} does not exist.`);
        return NextResponse.json({ error: "Period not found" }, { status: 404 });
      }
  
      let decision = await prisma.orderDecision.findUnique({
        where: {
          periodId_materialId: {
              materialId,
              periodId: Number(params.periodId),
          },
        },
      });
  
      if (decision) {
        decision = await prisma.orderDecision.update({
          where: {
            periodId_materialId: {
              materialId,
              periodId: Number(params.periodId),
          },
          },
          data: {
            amount,
            mode
          },
        });
      } else {
        decision = await prisma.orderDecision.create({
          data: {
            materialId,
            amount,
            mode,
            periodId: Number(params.periodId)
          },
        });
      }
  
      return NextResponse.json(decision, { status: 201 });
    } catch (error) {
      console.error("Error creating or updating orderDecision:", error);
      return NextResponse.json({ error: "Error creating or updating orderDecision" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }