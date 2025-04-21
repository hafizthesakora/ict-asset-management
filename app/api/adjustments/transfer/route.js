import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const {
      transferStockQty,
      itemId,
      peopleId,
      givingWarehouseId,
      notes,
      referenceNumber,
    } = await request.json();

    // the Giving warehouse
    const givingWarehouse = await db.warehouse.findUnique({
      where: {
        id: givingWarehouseId,
      },
    });

    //Get current stock
    const currentGivingStock = givingWarehouse.stockQty;

    if (parseInt(currentGivingStock) > parseInt(transferStockQty)) {
      const newGivingStock =
        parseInt(currentGivingStock) - parseInt(transferStockQty);

      // Update Stock
      const updateGivingPerson = await db.warehouse.update({
        where: {
          id: givingWarehouseId,
        },
        data: {
          stockQty: newGivingStock,
        },
      });

      // GEt the receiving person
      const receivingPerson = await db.people.findUnique({
        where: {
          id: peopleId,
        },
      });

      //Get current stock
      const currentReceivingStock = receivingPerson.stockQty;
      const newReceivingStock =
        parseInt(currentReceivingStock) + parseInt(transferStockQty);

      // Update Stock
      const updateReceivingPerson = await db.people.update({
        where: {
          id: peopleId,
        },
        data: {
          stockQty: newReceivingStock,
        },
      });

      const adjustment = await db.transferStockAdjustment.create({
        data: {
          transferStockQty: parseInt(transferStockQty),
          itemId,
          peopleId,
          givingWarehouseId,
          notes,
          referenceNumber,
        },
      });
      console.log(adjustment);
      return NextResponse.json(adjustment);
    } else {
      return NextResponse.json(
        {
          data: null,
          message: 'Giving warehouse has no enough stock',
        },
        { status: 409 }
      );
    }
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
    const adjustments = await db.transferStockAdjustment.findMany({
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
    const deleteAdjustment = await db.transferStockAdjustment.delete({
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
        message: 'Failed to delete tranfers',
      },
      {
        status: 500,
      }
    );
  }
}
