import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { create } from "xmlbuilder2";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { periodId: string } }
) {
  const extractNumbers = (materialId: string): string => {
    const match = materialId.match(/\d+/);
    return match ? match[0] : "";
  };

  const periodId = parseInt(params.periodId);

  try {
    const doc = create({ version: "1.0" })
      .ele("input")
      .ele("qualitycontrol")
      .att("type", "no")
      .att("losequantity", "0")
      .att("delay", "0")
      .up();

    // Salewish
    const salewishes = await prisma.forecast.findMany({
      where: {
        periodId: periodId,
        forPeriod: periodId,
      },
      orderBy: {
        materialId: "asc",
      },
    });

    const sellwish = doc.ele("sellwish");
    for (const salewish of salewishes) {
      sellwish
        .ele("item")
        .att("article", extractNumbers(salewish.materialId))
        .att("quantity", String(salewish.amount))
        .up();
    }
    sellwish.up();

    // Additional Sales
    const additionalSales = await prisma.additionalSale.findMany({
      where: {
        periodId: periodId,
        forPeriod: periodId,
      },
      orderBy: {
        materialId: "asc",
      },
    });

    const additionalSalesSettings = await prisma.setting.findMany({
      where: {
        name: {
          contains: "selldirect",
        },
      },
    });

    const selldirect = doc.ele("selldirect");
    for (const additionalSale of additionalSales) {
      selldirect
        .ele("item")
        .att("article", extractNumbers(additionalSale.materialId))
        .att("quantity", String(additionalSale.amount))
        .att("price", additionalSalesSettings.find(as => (as.name === `selldirect_price_${additionalSale.materialId}`))?.value || "0.0")
        .att("penalty", additionalSalesSettings.find(as => (as.name === `selldirect_penalty_${additionalSale.materialId}`))?.value || "0.0")
        .up();
    }
    selldirect.up();

    // material orders
    const materialOrders = await prisma.orderDecision.findMany({
      where: {
        periodId: periodId,
        amount: {
          gt: 0,
        },
      },
      orderBy: {
        materialId: "asc",
      },
    });

    const orderlist = doc.ele("orderlist");
    for (const order of materialOrders) {
      orderlist
        .ele("order")
        .att("article", extractNumbers(order.materialId))
        .att("quantity", String(order.amount))
        .att("modus", String(order.mode))
        .up();
    }
    orderlist.up();

    // Production Orders
    const productionPlanResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${params.periodId}/reorderProduction`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!productionPlanResponse.ok) {
      throw new Error(`Failed to fetch production plan: ${productionPlanResponse.statusText}`);
    }

    const productionOrders = await productionPlanResponse.json();
    const productionlist = doc.ele("productionlist");
    for (const material of productionOrders) {
      console.log(material);
      productionlist
        .ele("production")
        .att("article", extractNumbers(material.materialId))
        .att("quantity", String(material.quantity))
        .up();
    }

    productionlist.up();

    // Worktime
    const worktimeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/period/${params.periodId}/worktime`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!worktimeResponse.ok) {
      throw new Error(`Failed to fetch worktime: ${productionPlanResponse.statusText}`);
    }

    const worktime = await worktimeResponse.json();
    
    const workingtimelist = doc.ele("workingtimelist");
    for (const workplace of Object.keys(worktime)) {
      workingtimelist
        .ele("workingtime")
        .att("station", workplace)
        .att("shift", String(worktime[workplace]?.numberOfShifts || "0"))
        .att("overtime", String(worktime[workplace]?.overtime || "0"))
        .up();
    }

    workingtimelist.up();

    // Rückgabe einer XML-Response
    return new NextResponse(doc.end({ prettyPrint: true }), {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error fetching productionPlanDecision:", error);
    const errorResponse = create({ version: "1.0" })
      .ele("response")
      .ele("status")
      .txt("error")
      .up()
      .ele("message")
      .txt("Error fetching productionPlanDecision")
      .end({ prettyPrint: true });

    return new Response(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}