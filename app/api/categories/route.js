import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title, description } = await request.json();

    const category = await db.category.create({
      data: {
        title,
        description,
      },
    });
    console.log(category);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create a category',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch categories',
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
    const deleteCategory = await db.category.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deleteCategory);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete categories',
      },
      {
        status: 500,
      }
    );
  }
}
