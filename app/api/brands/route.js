import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title } = await request.json();

    const brand = await db.brand.create({
      data: {
        title,
      },
    });
    console.log(brand);
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create a brand',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch brands',
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
    const deleteBrand = await db.brand.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deleteBrand);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete brands',
      },
      {
        status: 500,
      }
    );
  }
}
