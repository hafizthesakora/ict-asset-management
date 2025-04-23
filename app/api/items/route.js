import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const itemData = await request.json();
    //GEt the warehouse
    const warehouse = await db.warehouse.findUnique({
      where: {
        id: itemData.warehouseId,
      },
    });

    //Current stock of the warehouse
    const currentWarehouseStock = warehouse.stockQty;
    const newStockQty = parseInt(currentWarehouseStock) + parseInt(1);

    //Update the stock on the warehouse
    const updatedWarehouse = await db.warehouse.update({
      where: {
        id: itemData.warehouseId,
      },
      data: {
        stockQty: newStockQty,
      },
    });

    const item = await db.item.create({
      data: {
        title: itemData?.title,
        description: itemData?.description,
        categoryId: itemData?.categoryId,
        sku: itemData?.sku,
        barcode: itemData?.barcode,
        quantity: parseInt(1),
        unitId: itemData?.unitId,
        brandId: itemData?.brandId,
        supplierId: itemData?.supplierId,
        reOrderPoint: parseInt(itemData?.reOrderPoint),
        warehouseId: itemData?.warehouseId,
        imageUrl: itemData?.imageUrl,
        weight: parseFloat(itemData?.weight),
        dimensions: itemData?.dimensions,
        taxRate: parseFloat(itemData?.taxRate),
        notes: itemData?.notes,
        buyingPrice: parseFloat(itemData?.buyingPrice),
        sellingPrice: parseFloat(itemData?.sellingPrice),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create a item',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const items = await db.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        warehouse: true,
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch items',
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
    const deleteItem = await db.item.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deleteItem);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete item',
      },
      {
        status: 500,
      }
    );
  }
}
