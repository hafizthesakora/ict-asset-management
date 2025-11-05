import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { createAuditLog } from '@/lib/auditLog';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/constants/auditConstants';

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

    console.log('Transfer request data:', {
      transferStockQty,
      itemId,
      peopleId,
      givingWarehouseId,
      notes,
      referenceNumber,
    });

    // Validate required fields
    if (!itemId || !peopleId || !givingWarehouseId || !transferStockQty) {
      return NextResponse.json(
        {
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // the Giving warehouse
    const givingWarehouse = await db.warehouse.findUnique({
      where: {
        id: givingWarehouseId,
      },
    });

    if (!givingWarehouse) {
      return NextResponse.json(
        {
          message: 'Warehouse not found',
        },
        { status: 404 }
      );
    }

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

      // Update Item location to person
      const updateItem = await db.item.update({
        where: {
          id: itemId,
        },
        data: {
          currentLocationType: 'person',
          assignedToPersonId: peopleId,
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
          status: 'active',
        },
      });
      console.log(adjustment);

      // Create audit log
      await createAuditLog({
        action: AUDIT_ACTIONS.ASSIGN_ITEM,
        entityType: AUDIT_ENTITIES.ITEM,
        entityId: itemId,
        entityName: updateItem.title,
        performedBy: 'System',
        performedByEmail: null,
        details: {
          itemTitle: updateItem.title,
          serialNumber: updateItem.serialNumber,
          quantity: parseInt(transferStockQty),
          fromWarehouse: givingWarehouse.title,
          toPerson: receivingPerson.title,
          toPersonEmail: receivingPerson.email,
          referenceNumber,
          notes,
        },
        request,
      });

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
    console.error('Error creating transfer adjustment:', error);
    return NextResponse.json(
      {
        error: error.message,
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
