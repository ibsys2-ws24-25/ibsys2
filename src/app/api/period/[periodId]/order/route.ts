import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { periodId: string } }) {
    try {
      const { materialId, amount, orderPeriod, mode} = await request.json();
      let orderPeriodSet = undefined;
      if (!orderPeriod) {
        orderPeriodSet = parseInt(params.periodId);
      } else {
        orderPeriodSet = orderPeriod;
      }
      console.log(`Received data - PeriodID: ${params.periodId}, MaterialID: ${materialId}, Mode: ${mode}, Amount: ${amount}, OrderPeriod: ${orderPeriod}`);
  
      const periodExists = await prisma.period.findUnique({
        where: { id: Number(params.periodId) }
      });
  
      if (!periodExists) {
        console.error(`Period with ID ${params.periodId} does not exist.`);
        return NextResponse.json({ error: "Period not found" }, { status: 404 });
      }
  
      let decision = await prisma.order.findUnique({
        where: {
            orderPeriod_materialId: {
                materialId,
                orderPeriod: orderPeriodSet,
          },
        },
      });
  
      if (decision) {
        decision = await prisma.order.update({
          where: {
            orderPeriod_materialId: {
                materialId,
                orderPeriod: orderPeriodSet,
          },
          },
          data: {
            amount,
            mode
          },
        });
      } else {
        decision = await prisma.order.create({
          data: {
            materialId,
            orderPeriod: Number(params.periodId),
            amount,
            mode,
          },
        });
      }
  
      return NextResponse.json(decision, { status: 201 });
    } catch (error) {
      console.error("Error creating or updating order:", error);
      return NextResponse.json({ error: "Error creating or updating order" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }