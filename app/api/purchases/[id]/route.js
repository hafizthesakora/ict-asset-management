import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params: { id } }) {
  try {
    const purchase = await db.purchases.findUnique({
      where: {
        id,
      },
      include: {
        supplier: true,
      },
    });
    return NextResponse.json(purchase);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch purchase',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const purchaseData = await request.json();
    const purchase = await db.purchases.update({
      where: {
        id,
      },
      data: {
        item: purchaseData.item,
        quantity: parseInt(purchaseData.quantity),
        supplierId: purchaseData.supplierId,
        notes: purchaseData.notes,
        referenceNumber: purchaseData.referenceNumber,
        status: purchaseData.status,
      },
    });
    return NextResponse.json(purchase);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to update brand',
      },
      {
        status: 500,
      }
    );
  }
}
