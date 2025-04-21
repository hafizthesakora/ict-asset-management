import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topology, title, department, aow } = await request.json();

    const people = await db.people.create({
      data: {
        topology,
        title,
        department,
        aow,
      },
    });
    console.log(people);
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create a people',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const people = await db.people.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch people',
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
    const deletePeople = await db.people.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletePeople);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete people',
      },
      {
        status: 500,
      }
    );
  }
}
