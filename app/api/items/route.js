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
        // Set initial location to warehouse
        currentLocationType: 'warehouse',
        assignedToPersonId: null,
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
        unit: true,
        brand: true,
        supplier: true,
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
