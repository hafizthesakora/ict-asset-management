import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const purchaseData = await request.json();
    console.log(purchaseData);

    const purchase = await db.purchase.create({
      data: {
        products: purchaseData.products,
        quantity: purchaseData.quantity,
        supplierId: purchaseData.supplierId,
        notes: purchaseData.notes,
        referenceNumber: purchaseData.referenceNumber,
        status: purchaseData.status,
      },
    });
    return NextResponse.json(purchase);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to create a purchase',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const purchases = await db.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        supplier: true,
      },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch purchases',
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
    const deletePurchases = await db.purchase.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletePurchases);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete Purchase',
      },
      {
        status: 500,
      }
    );
  }
}
