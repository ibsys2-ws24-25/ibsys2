import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { create } from "xmlbuilder2";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { periodId: string } }
) {
  const periodId = parseInt(params.periodId);

  try {
    const doc = create({ version: "1.0" })
      .ele("response")
      .ele("periodId")
      .txt(String(periodId))
      .up()
      .ele("status")
      .txt("success")
      .end({ prettyPrint: true });

    // Rückgabe einer XML-Response
    return new NextResponse(doc, {
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