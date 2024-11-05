import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Error fetching settings" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
