import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  try {
    const statistics = await prisma.result.findMany({
      where: { type },
      orderBy: {
        periodId: "asc",
      },
    });

    if (statistics.length === 0) {
      return NextResponse.json(
        { message: `No statistics found for type: ${type}` },
        { status: 404 }
      );
    }

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching statistics." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}