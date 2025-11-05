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

    //Modify the Item to the new Qty and reset location
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        quantity: newQty,
        currentLocationType: 'warehouse',
        assignedToPersonId: null,
      },
    });

    //Get the person and decrease their stock count
    const person = await db.people.findUnique({
      where: {
        id: peopleId,
      },
    });

    const currentPersonStock = person.stockQty;
    const newPersonStock = Math.max(0, parseInt(currentPersonStock) - parseInt(addStockQty));

    const updatedPerson = await db.people.update({
      where: {
        id: peopleId,
      },
      data: {
        stockQty: newPersonStock,
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

    // Find and mark the active transfer adjustment as returned
    const activeTransfer = await db.transferStockAdjustment.findFirst({
      where: {
        itemId,
        peopleId,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (activeTransfer) {
      await db.transferStockAdjustment.update({
        where: {
          id: activeTransfer.id,
        },
        data: {
          status: 'returned',
        },
      });
    }

    const adjustment = await db.addStockAdjustment.create({
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
    const adjustments = await db.addStockAdjustment.findMany({
      orderBy: {
        createdAt: 'desc',
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
        people: true,
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
    const deleteAdjustment = await db.addStockAdjustment.delete({
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
