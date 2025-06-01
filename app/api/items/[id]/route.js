import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params: { id } }) {
  try {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        warehouse: true,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch item',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const itemData = await request.json();
    const item = await db.item.update({
      where: {
        id,
      },
      data: {
        title: itemData?.title,
        description: itemData?.description,
        categoryId: itemData?.categoryId,
        serialNumber: itemData?.serialNumber,
        barcode: itemData?.barcode,
        quantity: parseInt(1),
        unitId: itemData?.unitId,
        brandId: itemData?.brandId,
        supplierId: itemData?.supplierId,
        documentNumber: itemData?.documentNumber,
        year: parseInt(itemData.year),
        warehouseId: itemData?.warehouseId,
        imageUrl: itemData?.imageUrl,
        callOff: itemData?.callOff,
        assetTag: itemData?.assetTag,
        eniShare: parseFloat(itemData?.eniShare),
        notes: itemData?.notes,
        buyingPrice: parseFloat(itemData?.buyingPrice),
        model: itemData?.model,
      },
    });
    return NextResponse.json(item);
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
