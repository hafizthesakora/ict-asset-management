/**
 * Migration script to update existing item assignments
 * This script updates items that have active assignments but don't have
 * the currentLocationType and assignedToPersonId fields set
 */

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function migrateExistingAssignments() {
  console.log('Starting migration of existing assignments...\n');

  try {
    // Get all transfer adjustments (including those without status field)
    const allTransfers = await db.transferStockAdjustment.findMany({
      include: {
        item: true,
        people: true,
      },
    });

    console.log(`Found ${allTransfers.length} total transfers in database\n`);

    // Filter for active assignments (status = 'active' or status is null/undefined)
    const activeAssignments = allTransfers.filter(
      (transfer) => !transfer.status || transfer.status === 'active'
    );

    console.log(`Found ${activeAssignments.length} active assignments to process\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const assignment of activeAssignments) {
      // Check if item is already properly assigned
      if (
        assignment.item.currentLocationType === 'person' &&
        assignment.item.assignedToPersonId === assignment.peopleId
      ) {
        console.log(
          `✓ Skipping: Item ${assignment.item.serialNumber} already correctly assigned to ${assignment.people.title}`
        );
        skippedCount++;
        continue;
      }

      // Update the item to reflect the assignment
      await db.item.update({
        where: {
          id: assignment.itemId,
        },
        data: {
          currentLocationType: 'person',
          assignedToPersonId: assignment.peopleId,
        },
      });

      // Also update the transfer adjustment to set status to 'active' if not set
      if (!assignment.status) {
        await db.transferStockAdjustment.update({
          where: {
            id: assignment.id,
          },
          data: {
            status: 'active',
          },
        });
      }

      console.log(
        `✓ Updated: Item ${assignment.item.serialNumber} (${assignment.item.title}) assigned to ${assignment.people.title}`
      );
      updatedCount++;
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total active assignments found: ${activeAssignments.length}`);
    console.log(`Items updated: ${updatedCount}`);
    console.log(`Items already correct: ${skippedCount}`);
    console.log('Migration completed successfully!\n');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run the migration
migrateExistingAssignments()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
