import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function calculateOvertimeAndShifts(capacity: number) {
  let numberOfShifts = 1;
  let overtime = 0;

  if (capacity > 2400) {
    const maxCapacityWithOvertime = 2400 + 1200;

    if (capacity > maxCapacityWithOvertime) {
      numberOfShifts = 2;
      overtime = Math.max(0, Math.floor((capacity - 4800) / 5));
    } else {
      overtime = Math.floor((capacity - 2400) / 5);
    }
  }

  return { overtime, numberOfShifts };
}

async function updateExistingWorkplaces(periodId: number, workplaceCapacityMap: Record<string, number>) {
  try {
    const existingWorkplaces = await prisma.workplace.findMany({
      where: { periodId: periodId },
    });

    if (existingWorkplaces.length === 0) {
      console.log(`No workplaces found for period ${periodId}.`);
      return;
    }

    await Promise.all(
      existingWorkplaces.map(async (workplace) => {
        const calculatedCapacity = workplaceCapacityMap[workplace.name] || 0;
        
        const { overtime, numberOfShifts } = calculateOvertimeAndShifts(calculatedCapacity);

        const workplaceToUpdate = await prisma.workplace.findFirst({
          where: { name: workplace.name },
        });

        if (!workplaceToUpdate) {
          console.log(`Workplace with name ${workplace.name} not found.`);
          return;
        }

        await prisma.workplace.update({
          where: { id: workplaceToUpdate.id },
          data: {
            capacity: calculatedCapacity,
            overtime: overtime,
            numberOfShifts: numberOfShifts,
          },
        });
      })
    );

    console.log("Workplaces updated successfully!");

  } catch (error) {
    console.error('Error updating workplaces for the period:', error);
    throw new Error('Failed to update workplaces for the period.');
  }
}

async function createWorkplaces(periodId: number, workplaceCapacityMap: Record<string, number>) {
    try {
        const workplaceHelpers = await prisma.workplaceHelper.findMany();

        await Promise.all(
            workplaceHelpers.map(async (helper) => {
                const calculatedCapacity = workplaceCapacityMap[helper.id] || 0;
                const { overtime, numberOfShifts } = calculateOvertimeAndShifts(calculatedCapacity);
                await prisma.workplace.create({
                    data: {
                        name: helper.id,
                        capacity: calculatedCapacity,
                        overtime: overtime,
                        numberOfShifts: numberOfShifts,
                        periodId: periodId,
                    },
                });
            })
        );

        // console.log("Workplaces created!")

    } catch (error) {
        console.error('Error creating workplaces:', error);
        throw new Error('Failed to create new workplaces.');
    }
}


async function calculateTotalCapacity(request: Request, { params }: { params: { periodId: string } }) {
    const periodId = Number(params.periodId);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${periodId}/manufactoring-plan/`, {
            method: "GET",
        });
        if (!response.ok) throw new Error("Failed to fetch production plan.");

        const productionPlan: Record<string, number> = await response.json();
        if (!productionPlan || Object.keys(productionPlan).length === 0) throw new Error("Production plan is empty or invalid.");

        const workplaceCapacityMap: Record<string, number> = {};
        const materialIds = Object.keys(productionPlan);

        const materials = await prisma.material.findMany({
            where: { id: { in: materialIds } },
            include: { Workplaces: true },
        });

        const workplaceHelpers = await prisma.workplaceHelper.findMany();
        const workplaceHelperMap = Object.fromEntries(workplaceHelpers.map((helper) => [helper.id, helper]));

        const waitingQueueEntries = await prisma.waitingQueue.findMany({
            where: { periodId },
        });

        const previousCapacityMap = waitingQueueEntries.reduce<Record<number, number>>((acc, entry) => {
            if (entry.workplaceId) {
                acc[entry.workplaceId] = (acc[entry.workplaceId] || 0) + entry.timeneed;
            }
            return acc;
        }, {});

        for (const material of materials) {
            const productionQuantity = productionPlan[material.id];

            for (const workplaceMaterial of material.Workplaces) {
                const { workplaceId, procurementTime } = workplaceMaterial;
                const workplaceHelper = workplaceHelperMap[workplaceId];

                if (!procurementTime || !workplaceHelper) {
                    console.warn(`Missing data for material ${material.id} and workplace ${workplaceId}.`);
                    continue;
                }

                const materialCapacity = productionQuantity * procurementTime + workplaceHelper.setupTime;
                // console.log(`Material capacity for ${material.id} is ${materialCapacity}`)

                workplaceCapacityMap[workplaceId] = (workplaceCapacityMap[workplaceId] || 0) + materialCapacity;
                // console.log(`current capacity for workplace ${workplaceId} is ${workplaceCapacityMap[workplaceId]}`)

            }
        }

        for (const [workplaceId, previousCapacity] of Object.entries(previousCapacityMap)) {
            workplaceCapacityMap[Number(workplaceId)] =
                (workplaceCapacityMap[Number(workplaceId)] || 0) + previousCapacity;
        }

        const existingPeriod = await prisma.period.findUnique({
            where: { id: periodId },
            include: { Workplace: true },
        });

        // console.log(`existingPeriod workplace: ${JSON.stringify(existingPeriod, null, 2)}`);

        if (!existingPeriod) {
          console.error("No existing period found. Creating workplaces is not allowed in this case.");
          throw new Error("Cannot proceed: No existing period found.");
      }

        if (existingPeriod.Workplace && existingPeriod.Workplace.length > 0) {
            await updateExistingWorkplaces(periodId, workplaceCapacityMap);
        } else {
            await createWorkplaces(periodId, workplaceCapacityMap);
        }

        const result = Object.keys(workplaceCapacityMap).reduce((acc, workplaceId) => {
          const capacity = workplaceCapacityMap[workplaceId];
          const { overtime, numberOfShifts } = calculateOvertimeAndShifts(capacity);
          acc[workplaceId] = { capacity, overtime, numberOfShifts };
          return acc;
      }, {} as Record<string, { capacity: number; overtime: number; numberOfShifts: number }>);

      return NextResponse.json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error calculating total capacity:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Unknown error calculating total capacity:", error);
            return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
        }
    } finally {
        await prisma.$disconnect();
    }
}

async function createProductionOrderEntries(request: Request, { params }: { params: { periodId: string } }) {
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
/*
export async function getWorkplaceDetails(request: Request, { params }: { params: { periodId: string } }) {
  const periodId = Number(params.periodId);

  if (!periodId || isNaN(Number(periodId))) {
      throw new Error('Invalid period ID' );
  }

  try {
      const workplaces = await prisma.workplace.findMany({
          where: { periodId: Number(periodId) },
          select: {
              name: true,
              overtime: true,
              numberOfShifts: true,
          },
      });

      if (!workplaces || workplaces.length === 0) {
          throw new Error("No workplaces found for this period");
      }

      const workplaceDetails = workplaces.reduce((acc, workplace) => {
        acc[workplace.name] = {
          overtime: workplace.overtime ?? 0,
          numberOfShifts: workplace.numberOfShifts,
        };
          return acc;
      }, {} as Record<string, { overtime: number; numberOfShifts: number }>);

      return NextResponse.json(workplaceDetails);
  } catch (error: unknown) {
      console.error('Error fetching workplace details:', error);
      return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}
*/

export { calculateTotalCapacity as GET, createProductionOrderEntries as POST };
