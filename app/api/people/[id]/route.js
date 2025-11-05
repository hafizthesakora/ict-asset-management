import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params: { id } }) {
  try {
    const people = await db.people.findUnique({
      where: {
        id,
      },
      include: {
        assignedItems: {
          include: {
            category: true,
            brand: true,
            unit: true,
            warehouse: true,
            supplier: true,
          },
        },
        transferStockAdjustments: {
          where: {
            status: 'active',
          },
          include: {
            item: {
              include: {
                category: true,
                brand: true,
                unit: true,
                warehouse: true,
              },
            },
          },
        },
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
    const { topology, title, email, department, aow, contractEndDate } = await request.json();
    const people = await db.people.update({
      where: {
        id,
      },
      data: {
        topology,
        title,
        email,
        department,
        aow,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
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
