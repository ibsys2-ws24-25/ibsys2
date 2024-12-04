import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ProductProductionPlan } from '@/lib/apiTypes';

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

export async function GET(request: Request, { params }: { params: { periodId: string } }) {
    try {
        const prodPlan: ProductProductionPlan[] = [];
        const safetyStockDescicions = await prisma.productionPlanDecision.findMany({
            where: {
                periodId: Number(params.periodId),
                materialId: {
                    contains: "P",
                },
            },
        });
        
        const forecasts = await prisma.forecast.findMany({
            where: {
                periodId: Number(params.periodId),
                materialId: {
                    contains: "P",
                },
            },
        });

        const warehouseEnties = await prisma.warehouse.findMany({
            where: {
                periodId: Number(params.periodId),
                materialId: {
                    contains: "P",
                },
            },
        });

        const additionalSales = await prisma.additionalSale.findMany({
            where: {
                periodId: Number(params.periodId),
                materialId: {
                    contains: "P",
                },
            },
        });

        for (const forecast of forecasts) {
            let warehouseStock = 0;
        
            // Finde die Safety Stock Decision
            const safetyStockDecision = safetyStockDescicions.find(
                ss => ss.forPeriod === forecast.periodId && ss.materialId === forecast.materialId
            );

            const additionalSale = additionalSales.find(
                as => as.forPeriod === forecast.periodId && as.materialId === forecast.materialId
            );
        
            // Bestimme den Safety Stock (Standardwert ist 0)
            const safetyStock = safetyStockDecision ? safetyStockDecision.safetyStock : 0;

            const additionalSaleAmount = additionalSale ? additionalSale.amount : 0;
        
            if (forecast.forPeriod === parseInt(params.periodId)) {
                // Warehouse Stock für die aktuelle Periode
                const warehouseEntry = warehouseEnties.find(wh => wh.materialId === forecast.materialId);
                warehouseStock = warehouseEntry ? warehouseEntry.amount : 0;
            } else {
                // Warehouse Stock aus der Safety Stock Decision der vorherigen Periode (bei zukünftigen Perioden)
                const previousSafetyStockDecision = safetyStockDescicions.find(
                    ss => ss.materialId === forecast.materialId && ss.forPeriod === forecast.periodId - 1
                );
                warehouseStock = previousSafetyStockDecision ? previousSafetyStockDecision.safetyStock : 0;
            }
        
            // Berechnung der Differenz
            const calculatedDiff = warehouseStock - forecast.amount - safetyStock - additionalSaleAmount;
            let prodRequiremement = 0;

            if (calculatedDiff < 0) {
                prodRequiremement = Math.abs(calculatedDiff);
            }

            prodPlan.push({
                periodId: forecast.forPeriod,
                materialId: forecast.materialId,
                amount: prodRequiremement,
            });
        }

        return NextResponse.json(prodPlan);
    } catch (error) {
        console.error("Error fetching productionPlanDecision:", error);
        return NextResponse.json({ error: "Error fetching productionPlanDecision" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
