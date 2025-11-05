import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accessType, systemName, accessLevel, description, peopleId } =
      await request.json();

    const access = await db.access.create({
      data: {
        accessType,
        systemName,
        accessLevel,
        description,
        peopleId,
        status: 'active',
      },
    });

    return NextResponse.json(access);
  } catch (error) {
    console.error('Error creating access:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to create access',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const accesses = await db.access.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        people: true,
      },
    });
    return NextResponse.json(accesses);
  } catch (error) {
    console.error('Error fetching accesses:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch accesses',
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
    const deleteAccess = await db.access.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deleteAccess);
  } catch (error) {
    console.error('Error deleting access:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to delete access',
      },
      {
        status: 500,
      }
    );
  }
}
