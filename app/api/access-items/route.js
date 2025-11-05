import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, description, categoryId } = await request.json();

    const accessItem = await db.accessItem.create({
      data: {
        name,
        description,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(accessItem);
  } catch (error) {
    console.error('Error creating access item:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to create access item',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const categoryId = request.nextUrl.searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const accessItems = await db.accessItem.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(accessItems);
  } catch (error) {
    console.error('Error fetching access items:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch access items',
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
    const accessItem = await db.accessItem.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(accessItem);
  } catch (error) {
    console.error('Error deleting access item:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to delete access item',
      },
      {
        status: 500,
      }
    );
  }
}
