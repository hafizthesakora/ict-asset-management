import db from '@/lib/db';
import { NextResponse } from 'next/server';

// ONE-TIME DATA FIX: Reset item locations to match their actual state
export async function POST(request) {
  try {
    // Get all items
    const allItems = await db.item.findMany();

    let fixedCount = 0;
    let alreadyCorrect = 0;

    for (const item of allItems) {
      // If item has assignedToPersonId, it should be with person
      if (item.assignedToPersonId) {
        if (item.currentLocationType !== 'person') {
          await db.item.update({
            where: { id: item.id },
            data: { currentLocationType: 'person' }
          });
          fixedCount++;
        } else {
          alreadyCorrect++;
        }
      }
      // If no assignedToPersonId, it should be in warehouse
      else {
        if (item.currentLocationType !== 'warehouse') {
          await db.item.update({
            where: { id: item.id },
            data: {
              currentLocationType: 'warehouse',
              assignedToPersonId: null
            }
          });
          fixedCount++;
        } else {
          alreadyCorrect++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Data fix completed successfully`,
      stats: {
        totalItems: allItems.length,
        itemsFixed: fixedCount,
        alreadyCorrect: alreadyCorrect
      }
    });

  } catch (error) {
    console.error('Error fixing item locations:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fix item locations',
      },
      { status: 500 }
    );
  }
}
