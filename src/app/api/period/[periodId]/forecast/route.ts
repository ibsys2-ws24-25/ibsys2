import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { periodId: string } }) {
    try {
      const { forPeriod, materialId, amount } = await request.json();
      let forPeriodSet = undefined;
      if (!forPeriod) {
          forPeriodSet = parseInt(params.periodId);
      } else {
          forPeriodSet = forPeriod;
      }
  
      const periodExists = await prisma.period.findUnique({
        where: { id: Number(params.periodId) }
      });
  
      if (!periodExists) {
        console.error(`Period with ID ${params.periodId} does not exist.`);
        return NextResponse.json({ error: "Period not found" }, { status: 404 });
      }
  
      let forecast = await prisma.forecast.findUnique({
        where: {
          periodId_materialId_forPeriod: {
            periodId: Number(params.periodId),
            materialId,
            forPeriod: forPeriodSet,
          },
        },
      });

      if (forecast) {
        forecast = await prisma.forecast.update({
            where: {
                periodId_materialId_forPeriod: {
                    periodId: Number(params.periodId),
                    materialId: materialId,
                    forPeriod: forPeriodSet,
                },
            },
            data: {
                amount: amount,
            },
        });
      } else {
        forecast = await prisma.forecast.create({
          data: {
            periodId: Number(params.periodId),
            materialId,
            forPeriod: forPeriodSet,
            amount,
          },
        });
      }
  
      return NextResponse.json(forecast, { status: 201 });
    } catch (error) {
      console.error("Error creating or updating forecast:", error);
      return NextResponse.json({ error: "Error creating or updating forecast decision" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}