import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { createAuditLog } from '@/lib/auditLog';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/constants/auditConstants';

export async function POST(request) {
  try {
    const {
      peopleId,
      demobPerformedBy,
      demobPerformedByEmail,
      itemsReturned,
      accessesRevoked,
    } = await request.json();

    // Process each checked item - return to warehouse
    for (const item of itemsReturned) {
      if (item.checked) {
        // Find the active transfer adjustment
        const activeTransfer = await db.transferStockAdjustment.findFirst({
          where: {
            itemId: item.id,
            peopleId: peopleId,
            status: 'active',
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (activeTransfer) {
          // Get the item details
          const itemData = await db.item.findUnique({
            where: { id: item.id },
          });

          if (itemData) {
            const returnQty = activeTransfer.transferStockQty || 1;
            const warehouseId = activeTransfer.givingWarehouseId;

            // Update item - reset to warehouse
            await db.item.update({
              where: { id: item.id },
              data: {
                quantity: itemData.quantity + returnQty,
                currentLocationType: 'warehouse',
                assignedToPersonId: null,
              },
            });

            // Update person - decrease stock count
            const person = await db.people.findUnique({
              where: { id: peopleId },
            });

            if (person) {
              await db.people.update({
                where: { id: peopleId },
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
                itemId: item.id,
                peopleId: peopleId,
                receivingWarehouseId: warehouseId,
                notes: `Returned via demobilization - ${demobPerformedBy}`,
                referenceNumber: `DEMOB-${Date.now()}`,
              },
            });

            console.log(`Item ${item.id} returned to warehouse`);
          }
        }
      }
    }

    // Process each checked access - revoke
    for (const access of accessesRevoked) {
      if (access.checked) {
        await db.employeeAccess.update({
          where: { id: access.id },
          data: {
            status: 'revoked',
            revokedDate: new Date(),
            revokedBy: demobPerformedBy,
            notes: `Revoked via demobilization by ${demobPerformedBy}`,
          },
        });
        console.log(`Access ${access.id} revoked`);
      }
    }

    // Create demob document
    const demobDocument = await db.demobDocument.create({
      data: {
        peopleId,
        demobPerformedBy,
        demobPerformedByEmail,
        itemsReturned,
        accessesRevoked,
        isCompleted: true, // Mark as completed since items/accesses are processed
      },
    });

    // Update person status to inactive (demobilized)
    const person = await db.people.update({
      where: { id: peopleId },
      data: { status: 'inactive' },
    });

    console.log(`Employee ${peopleId} demobilized successfully`);

    // Create audit log
    await createAuditLog({
      action: AUDIT_ACTIONS.DEMOBILIZE,
      entityType: AUDIT_ENTITIES.PEOPLE,
      entityId: peopleId,
      entityName: person.title,
      performedBy: demobPerformedBy,
      performedByEmail: demobPerformedByEmail,
      details: {
        itemsReturned: itemsReturned.filter((i) => i.checked).length,
        accessesRevoked: accessesRevoked.filter((a) => a.checked).length,
        demobDocumentId: demobDocument.id,
        items: itemsReturned.filter((i) => i.checked).map((i) => ({
          id: i.id,
          title: i.title,
          serialNumber: i.serialNumber,
        })),
        accesses: accessesRevoked.filter((a) => a.checked).map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category,
        })),
      },
      request,
    });

    return NextResponse.json(demobDocument);
  } catch (error) {
    console.error('Error creating demob document:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to create demob document',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const peopleId = request.nextUrl.searchParams.get('peopleId');

    const where = peopleId ? { peopleId } : {};

    const demobDocuments = await db.demobDocument.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        people: true,
      },
    });

    return NextResponse.json(demobDocuments);
  } catch (error) {
    console.error('Error fetching demob documents:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch demob documents',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, signedDocumentUrl, isCompleted } = await request.json();

    const updateData = {};
    if (signedDocumentUrl) updateData.signedDocumentUrl = signedDocumentUrl;
    if (typeof isCompleted === 'boolean') {
      updateData.isCompleted = isCompleted;
    }

    const demobDocument = await db.demobDocument.update({
      where: { id },
      data: updateData,
    });

    // If completed, update person status to inactive
    if (isCompleted) {
      await db.people.update({
        where: { id: demobDocument.peopleId },
        data: { status: 'inactive' },
      });
    }

    return NextResponse.json(demobDocument);
  } catch (error) {
    console.error('Error updating demob document:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to update demob document',
      },
      {
        status: 500,
      }
    );
  }
}
