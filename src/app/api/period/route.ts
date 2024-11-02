import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const periods = await prisma.period.findMany();

    return NextResponse.json(periods);
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json({ error: "Error fetching periods" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
    const prisma = new PrismaClient();
    
    try {
      const { id } = await request.json();
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      const newPeriod = await prisma.period.create({
        data: {
          id,
        },
      });
  
      return NextResponse.json(newPeriod, { status: 201 });
    } catch (error) {
      console.error("Error creating period:", error);
      return NextResponse.json({ error: "Error creating period" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}