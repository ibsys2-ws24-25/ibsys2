import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

export async function PUT(request: Request, { params }: { params: { name: string } }) {
    try {
      const { value } = await request.json();
  
      if (typeof value !== 'string') {
        return NextResponse.json({ error: "Invalid value format" }, { status: 400 });
      }
  
      const updatedSetting = await prisma.setting.update({
        where: {
          name: params.name,
        },
        data: {
          value,
        },
      });
  
      return NextResponse.json(updatedSetting);
    } catch (error) {
      console.error("Error updating setting:", error);
      
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: "Setting not found" }, { status: 404 });
      }
      
      return NextResponse.json({ error: "Error updating setting" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}
