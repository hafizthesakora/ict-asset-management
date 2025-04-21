import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title, abbreviation } = await request.json();

    const unit = await db.unit.create({
      data: {
        title,
        abbreviation,
      },
    });
    console.log(unit);
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create a unit',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch units',
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
    const deleteUnit = await db.unit.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deleteUnit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete units',
      },
      {
        status: 500,
      }
    );
  }
}
