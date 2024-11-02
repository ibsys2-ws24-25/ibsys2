import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { warehouseId: string } }) {
  const { warehouseId } = params;

  try {
    if (!warehouseId || isNaN(Number(warehouseId))) {
      return NextResponse.json({ error: "Invalid warehouse ID" }, { status: 400 });
    }

    const deletedWarehouse = await prisma.warehouse.delete({
      where: {
        id: Number(warehouseId),
      },
    });

    return NextResponse.json({ message: "Warehouse entry deleted successfully", deletedWarehouse });
  } catch (error) {
    console.error("Error deleting warehouse entry:", error);
    return NextResponse.json({ error: "Error deleting warehouse entry" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}