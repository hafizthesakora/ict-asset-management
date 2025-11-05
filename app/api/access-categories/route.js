import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title, description } = await request.json();

    const category = await db.accessCategory.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating access category:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to create access category',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const categories = await db.accessCategory.findMany({
      orderBy: {
        title: 'asc',
      },
      include: {
        accessItems: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching access categories:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch access categories',
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
    const category = await db.accessCategory.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error deleting access category:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to delete access category',
      },
      {
        status: 500,
      }
    );
  }
}
