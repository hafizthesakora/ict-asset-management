import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params: { id } }) {
  try {
    const people = await db.people.findUnique({
      where: {
        id,
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

export async function PUT(request, { params: { id } }) {
  try {
    const { topology, title, department, aow } = await request.json();
    const people = await db.people.update({
      where: {
        id,
      },
      data: {
        topology,
        title,
        department,
        aow,
      },
    });
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to update people',
      },
      {
        status: 500,
      }
    );
  }
}
