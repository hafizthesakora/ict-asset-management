/**
 * Script to fix item locations
 * Sets currentLocationType for all items based on their actual state
 */

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function fixItemLocations() {
  console.log('Starting item location fix...\n');

  try {
    // Get all items
    const allItems = await db.item.findMany({
      include: {
        transferStockAdjustments: {
          where: {
            status: 'active',
          },
        },
      },
    });

    console.log(`Found ${allItems.length} items in database\n`);

    let updatedToWarehouse = 0;
    let updatedToPerson = 0;
    let alreadyCorrect = 0;

    for (const item of allItems) {
      const activeAssignments = item.transferStockAdjustments.filter(
        (adj) => adj.status === 'active'
      );

      if (activeAssignments.length > 0) {
        // Item is assigned to a person
        const latestAssignment = activeAssignments[0];

        if (
          item.currentLocationType === 'person' &&
          item.assignedToPersonId === latestAssignment.peopleId
        ) {
          console.log(
            `✓ Item ${item.serialNumber} already correctly assigned`
          );
          alreadyCorrect++;
        } else {
          await db.item.update({
            where: { id: item.id },
            data: {
              currentLocationType: 'person',
              assignedToPersonId: latestAssignment.peopleId,
            },
          });
          console.log(
            `✓ Fixed: Item ${item.serialNumber} set to 'person' (was: ${item.currentLocationType || 'NOT SET'})`
          );
          updatedToPerson++;
        }
      } else {
        // Item is in warehouse
        if (item.currentLocationType === 'warehouse' && !item.assignedToPersonId) {
          console.log(
            `✓ Item ${item.serialNumber} already correctly in warehouse`
          );
          alreadyCorrect++;
        } else {
          await db.item.update({
            where: { id: item.id },
            data: {
              currentLocationType: 'warehouse',
              assignedToPersonId: null,
            },
          });
          console.log(
            `✓ Fixed: Item ${item.serialNumber} set to 'warehouse' (was: ${item.currentLocationType || 'NOT SET'})`
          );
          updatedToWarehouse++;
        }
      }
    }

    console.log('\n=== Fix Summary ===');
    console.log(`Total items: ${allItems.length}`);
    console.log(`Already correct: ${alreadyCorrect}`);
    console.log(`Updated to warehouse: ${updatedToWarehouse}`);
    console.log(`Updated to person: ${updatedToPerson}`);
    console.log('\nLocation fix completed successfully!\n');
  } catch (error) {
    console.error('Error during fix:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run the fix
fixItemLocations()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fix failed:', error);
    process.exit(1);
  });
