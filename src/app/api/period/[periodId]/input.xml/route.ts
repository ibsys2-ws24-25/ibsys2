import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { create } from "xmlbuilder2";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { periodId: string } }
) {
  const extractNumbers = (materialId: string): string => {
    const match = materialId.match(/\d+/); // Sucht nach einer oder mehreren Zahlen
    return match ? match[0] : ""; // Gibt die erste gefundene Zahl zurück oder einen leeren String
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

    const selldirect = doc.ele("selldirect");
    for (const additionalSale of additionalSales) {
      selldirect
        .ele("item")
        .att("article", extractNumbers(additionalSale.materialId))
        .att("quantity", String(additionalSale.amount))
        .att("price", "0.0")
        .att("penalty", "0.0")
        .up();
    }
    selldirect.up();

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