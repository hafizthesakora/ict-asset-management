const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function cleanString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/\r\n|\r|\n/g, ' ');
}

async function importData() {
  try {
    console.log('🚀 Starting final Excel data import...\n');

    const workbook = XLSX.readFile('/Users/macbook/Desktop/Copy of 2025 Asset Reconciliation-ICT (version 1).xlsx');
    const sheet = workbook.Sheets['Outstanding'];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    console.log(`📊 Found ${data.length} rows total\n`);

    // Load existing data
    const existingItems = await prisma.item.findMany({ select: { serialNumber: true } });
    const existingSerials = new Set(existingItems.map(i => i.serialNumber));
    console.log(`✅ Found ${existingSerials.size} existing items\n`);

    // Get defaults
    let defaultUnit = await prisma.unit.findFirst();
    let defaultBrand = await prisma.brand.findFirst();
    let defaultWarehouse = await prisma.warehouse.findFirst();
    let defaultSupplier = await prisma.supplier.findFirst();

    console.log('📦 Processing items...\n');

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        const assetTag = cleanString(row['Identification \r\nNumber ']);
        const assetDescription = cleanString(row['Asset Description']);
        const serialNumber = cleanString(row['Serial Number']) || `AUTO-${assetTag || (Date.now() + i)}`;
        const assetType = cleanString(row['Asset Type']);
        const amountGHS = parseFloat(row['Amount (GHS)']) || 0;
        const location = cleanString(row['Location']);
        const vendorSupplier = cleanString(row['Vendor/Supplier']);
        const status = cleanString(row['STATUS']);
        const model = cleanString(row['Asset Class']);

        // Skip if no essential data
        if (!assetDescription || !assetType) {
          skipped++;
          continue;
        }

        // Skip if already exists
        if (existingSerials.has(serialNumber)) {
          skipped++;
          continue;
        }

        // Get or create category
        let category = await prisma.category.findFirst({
          where: { title: assetType },
        });

        if (!category) {
          try {
            category = await prisma.category.create({
              data: {
                title: assetType,
                description: `${assetType} assets`,
              },
            });
          } catch (err) {
            // Might have been created by parallel process, try to fetch again
            category = await prisma.category.findFirst({
              where: { title: assetType },
            });
          }
        }

        if (!category) {
          skipped++;
          continue;
        }

        // Get or create supplier
        let supplier = defaultSupplier;
        if (vendorSupplier && vendorSupplier !== '') {
          const existingSupplier = await prisma.supplier.findFirst({
            where: { title: vendorSupplier },
          });

          if (existingSupplier) {
            supplier = existingSupplier;
          } else {
            try {
              supplier = await prisma.supplier.create({
                data: {
                  title: vendorSupplier,
                  supplierCode: `SUP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                },
              });
            } catch (err) {
              supplier = defaultSupplier;
            }
          }
        }

        // Get or create person if location is provided
        let assignedToPersonId = null;
        let currentLocationType = 'warehouse';

        if (location && location !== '') {
          let person = await prisma.people.findFirst({
            where: { title: location },
          });

          if (!person) {
            try {
              person = await prisma.people.create({
                data: {
                  title: location,
                  status: 'active',
                },
              });
            } catch (err) {
              // Person might have been created, try to fetch again
              person = await prisma.people.findFirst({
                where: { title: location },
              });
            }
          }

          if (person) {
            assignedToPersonId = person.id;
            currentLocationType = 'person';
          }
        }

        // Create item
        await prisma.item.create({
          data: {
            title: assetDescription,
            description: assetDescription,
            categoryId: category.id,
            serialNumber,
            barcode: serialNumber,
            quantity: 1,
            unitId: defaultUnit.id,
            brandId: defaultBrand.id,
            assetTag,
            buyingPrice: amountGHS,
            supplierId: supplier.id,
            warehouseId: defaultWarehouse.id,
            currentLocationType,
            assignedToPersonId,
            documentNumber: cleanString(row['Invoice Number']),
            model,
            notes: `Status: ${status}`,
          },
        });

        created++;
        existingSerials.add(serialNumber); // Prevent duplicates

        // Log progress
        if ((i + 1) % 100 === 0) {
          console.log(`✅ Progress: ${i + 1}/${data.length} (Created: ${created}, Skipped: ${skipped}, Errors: ${errors})`);
        }
      } catch (error) {
        errors++;
        if (errors < 10) {
          console.error(`❌ Error at row ${i + 1}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Import completed!');
    console.log(`✅ Created: ${created}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
