import db from '@/lib/db';
import { NextResponse } from 'next/server';

// ONE-TIME DATA FIX: Unassign all items that don't have proper TransferStockAdjustment records
export async function POST(request) {
  try {
    // Get all items that are assigned
    const assignedItems = await db.item.findMany({
      where: {
        assignedToPersonId: { not: null },
        currentLocationType: 'person',
      },
      include: {
        warehouse: true,
      },
    });

    console.log(`Found ${assignedItems.length} items marked as assigned`);

    // Get all active transfer adjustments
    const activeTransfers = await db.transferStockAdjustment.findMany({
      where: {
        status: 'active',
      },
    });

    const activeTransferItemIds = new Set(activeTransfers.map(t => t.itemId));
    console.log(`Found ${activeTransfers.length} active transfer records`);

    // Find items that are assigned but don't have transfer records
    const itemsToUnassign = assignedItems.filter(item => !activeTransferItemIds.has(item.id));

    console.log(`Need to unassign ${itemsToUnassign.length} items`);

    if (itemsToUnassign.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No items need to be unassigned',
        stats: {
          totalAssignedItems: assignedItems.length,
          itemsWithTransferRecords: activeTransfers.length,
          itemsUnassigned: 0,
        },
      });
    }

    // Group items by person and warehouse for stock updates
    const personStockUpdates = {};
    const warehouseStockUpdates = {};

    for (const item of itemsToUnassign) {
      // Track person stock decreases
      if (!personStockUpdates[item.assignedToPersonId]) {
        personStockUpdates[item.assignedToPersonId] = 0;
      }
      personStockUpdates[item.assignedToPersonId]++;

      // Track warehouse stock increases
      if (!warehouseStockUpdates[item.warehouseId]) {
        warehouseStockUpdates[item.warehouseId] = 0;
      }
      warehouseStockUpdates[item.warehouseId]++;
    }

    // Unassign all items (in batches for better performance)
    const batchSize = 100;
    let unassignedCount = 0;

    for (let i = 0; i < itemsToUnassign.length; i += batchSize) {
      const batch = itemsToUnassign.slice(i, i + batchSize);
      const batchIds = batch.map(item => item.id);

      await db.item.updateMany({
        where: {
          id: { in: batchIds },
        },
        data: {
          currentLocationType: 'warehouse',
          assignedToPersonId: null,
        },
      });

      unassignedCount += batch.length;
      console.log(`Unassigned ${unassignedCount}/${itemsToUnassign.length} items`);
    }

    // Update person stock counts
    for (const [personId, decreaseAmount] of Object.entries(personStockUpdates)) {
      const person = await db.people.findUnique({
        where: { id: personId },
      });

      await db.people.update({
        where: { id: personId },
        data: {
          stockQty: Math.max(0, person.stockQty - decreaseAmount),
        },
      });
      console.log(`Updated person ${personId}: decreased stock by ${decreaseAmount}`);
    }

    // Update warehouse stock counts
    for (const [warehouseId, increaseAmount] of Object.entries(warehouseStockUpdates)) {
      const warehouse = await db.warehouse.findUnique({
        where: { id: warehouseId },
      });

      await db.warehouse.update({
        where: { id: warehouseId },
        data: {
          stockQty: warehouse.stockQty + increaseAmount,
        },
      });
      console.log(`Updated warehouse ${warehouseId}: increased stock by ${increaseAmount}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unassigned items without transfer records',
      stats: {
        totalAssignedItems: assignedItems.length,
        itemsWithTransferRecords: activeTransfers.length,
        itemsUnassigned: unassignedCount,
        peopleUpdated: Object.keys(personStockUpdates).length,
        warehousesUpdated: Object.keys(warehouseStockUpdates).length,
      },
    });

  } catch (error) {
    console.error('Error unassigning items:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to unassign items',
      },
      { status: 500 }
    );
  }
}
