import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const setting = await prisma.setting.findUnique({
      where: {
        name: params.name,
      },
    });

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json({ error: "Error fetching setting" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
