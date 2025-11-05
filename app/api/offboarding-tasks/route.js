import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const {
      taskType,
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      peopleId,
      accessId,
      itemId,
    } = await request.json();

    const task = await db.offboardingTask.create({
      data: {
        taskType,
        title,
        description,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        peopleId,
        accessId,
        itemId,
        status: 'pending',
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating offboarding task:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to create offboarding task',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const tasks = await db.offboardingTask.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        people: true,
        access: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching offboarding tasks:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch offboarding tasks',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, status, notes, completedDate } = await request.json();

    // First get the task to check if we need to auto-return an item
    const existingTask = await db.offboardingTask.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          message: 'Task not found',
        },
        { status: 404 }
      );
    }

    // If this is an item collection task being marked as "asset_collected", automatically return the item
    if (
      existingTask.taskType === 'item_collection' &&
      status === 'asset_collected' &&
      existingTask.itemId
    ) {
      console.log('Auto-returning item:', existingTask.itemId);

      // Find the active transfer adjustment
      const activeTransfer = await db.transferStockAdjustment.findFirst({
        where: {
          itemId: existingTask.itemId,
          peopleId: existingTask.peopleId,
          status: 'active',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (activeTransfer) {
        // Get the item
        const item = await db.item.findUnique({
          where: { id: existingTask.itemId },
        });

        if (item) {
          const returnQty = activeTransfer.transferStockQty || 1;
          const warehouseId = activeTransfer.givingWarehouseId;

          // Update item - reset to warehouse
          await db.item.update({
            where: { id: existingTask.itemId },
            data: {
              quantity: item.quantity + returnQty,
              currentLocationType: 'warehouse',
              assignedToPersonId: null,
            },
          });

          // Update person - decrease stock count
          const person = await db.people.findUnique({
            where: { id: existingTask.peopleId },
          });

          if (person) {
            await db.people.update({
              where: { id: existingTask.peopleId },
              data: {
                stockQty: Math.max(0, person.stockQty - returnQty),
              },
            });
          }

          // Update warehouse - increase stock count
          const warehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
          });

          if (warehouse) {
            await db.warehouse.update({
              where: { id: warehouseId },
              data: {
                stockQty: warehouse.stockQty + returnQty,
              },
            });
          }

          // Mark transfer as returned
          await db.transferStockAdjustment.update({
            where: { id: activeTransfer.id },
            data: { status: 'returned' },
          });

          // Create AddStockAdjustment record
          await db.addStockAdjustment.create({
            data: {
              addStockQty: returnQty,
              itemId: existingTask.itemId,
              peopleId: existingTask.peopleId,
              receivingWarehouseId: warehouseId,
              notes: `Auto-returned via offboarding task: ${existingTask.title}`,
              referenceNumber: `OFFBOARD-${id}`,
            },
          });

          console.log('Item auto-returned successfully');
        }
      }
    }

    // Update the task
    const updateData = {
      status,
      notes,
    };

    if (completedDate) {
      updateData.completedDate = new Date(completedDate);
    }

    const task = await db.offboardingTask.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating offboarding task:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to update offboarding task',
      },
      {
        status: 500,
      }
    );
  }
}
