import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title, location, description, type } = await request.json();

    const warehouse = await db.warehouse.create({
      data: {
        title,
        location,
        description,
        warehouseType: type,
      },
    });
    console.log(warehouse);
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create warehouse',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const warehouse = await db.warehouse.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch warehouse',
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const deleteWarehouse = await db.warehouse.delete({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(deleteWarehouse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete warehouse',
      },
      {
        status: 500,
      }
    );
  }
}
