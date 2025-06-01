import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const {
      addStockQty,
      referenceNumber,
      itemId,
      peopleId,
      receivingWarehouseId,
      notes,
    } = await request.json();

    //Get the item
    const ItemToUpdate = await db.item.findUnique({
      where: {
        id: itemId,
      },
    });

    //Current Item Quantity
    const currentItemQty = ItemToUpdate.quantity;
    const newQty = parseInt(currentItemQty) + parseInt(addStockQty);

    //Modify the Item to the new Qty
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        quantity: newQty,
      },
    });

    //GEt the warehouse
    const warehouse = await db.warehouse.findUnique({
      where: {
        id: receivingWarehouseId,
      },
    });

    //Current stock of the warehouse
    const currentWarehouseStock = warehouse.stockQty;
    const newStockQty = parseInt(currentWarehouseStock) + parseInt(addStockQty);

    //Update the stock on the warehouse
    const updatedWarehouse = await db.warehouse.update({
      where: {
        id: receivingWarehouseId,
      },
      data: {
        stockQty: newStockQty,
      },
    });

    const adjustment = await db.addWarehouseAdjustment.create({
      data: {
        addStockQty: parseInt(addStockQty),
        itemId,
        peopleId,
        receivingWarehouseId,
        notes,
        referenceNumber,
      },
    });

    // Affect the ware house

    console.log(adjustment);
    return NextResponse.json(adjustment);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to create adjustment',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const adjustments = await db.addWarehouseAdjustment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(adjustments);
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: 'Failed to fetch adjustments',
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
    const deleteAdjustment = await db.addWarehouseAdjustment.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deleteAdjustment);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: 'Failed to delete assignment',
      },
      {
        status: 500,
      }
    );
  }
}
