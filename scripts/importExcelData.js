const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to parse dates from Excel
function parseExcelDate(dateStr) {
  if (!dateStr) return new Date();

  // Handle Excel date format (DD/MM/YYYY)
  const parts = dateStr.toString().split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  return new Date();
}

// Helper function to clean string (remove extra whitespace, line breaks)
function cleanString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/\r\n|\r|\n/g, ' ');
}

// Main import function
async function importData() {
  try {
    console.log('🚀 Starting Excel data import...\n');

    // Read Excel file
    const workbook = XLSX.readFile('/Users/macbook/Desktop/Copy of 2025 Asset Reconciliation-ICT (version 1).xlsx');
    const sheet = workbook.Sheets['Outstanding'];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    console.log(`📊 Found ${data.length} rows to import\n`);

    // Create default entities if they don't exist
    console.log('🔧 Setting up default entities...');

    // Get or create default unit
    let defaultUnit = await prisma.unit.findFirst();
    if (!defaultUnit) {
      defaultUnit = await prisma.unit.create({
        data: {
          title: 'Unit',
          abbreviation: 'Unit',
        },
      });
      console.log('✅ Created default unit');
    }

    // Get or create default brand
    let defaultBrand = await prisma.brand.findFirst();
    if (!defaultBrand) {
      defaultBrand = await prisma.brand.create({
        data: {
          title: 'Unknown Brand',
        },
      });
      console.log('✅ Created default brand');
    }

    // Get or create default warehouse
    let defaultWarehouse = await prisma.warehouse.findFirst();
    if (!defaultWarehouse) {
      defaultWarehouse = await prisma.warehouse.create({
        data: {
          title: 'Main Warehouse',
          location: 'Default Location',
          warehouseType: 'main',
        },
      });
      console.log('✅ Created default warehouse');
    }

    // Get or create default supplier
    let defaultSupplier = await prisma.supplier.findFirst();
    if (!defaultSupplier) {
      defaultSupplier = await prisma.supplier.create({
        data: {
          title: 'Unknown Supplier',
          supplierCode: 'SUP-0001',
        },
      });
      console.log('✅ Created default supplier');
    }

    console.log('\n📦 Processing items...\n');

    // Track statistics
    let created = 0;
    let skipped = 0;
    let errors = 0;

    // Cache for entities to avoid repeated DB queries
    const categoryCache = {};
    const supplierCache = {};
    const peopleCache = {};

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        // Clean up field names and values
        const assetTag = cleanString(row['Identification \r\nNumber ']);
        const assetDescription = cleanString(row['Asset Description']);
        const serialNumber = cleanString(row['Serial Number']) || `AUTO-${assetTag}` || `AUTO-${Date.now()}-${i}`;
        const invoiceNumber = cleanString(row['Invoice Number']);
        const assetType = cleanString(row['Asset Type']);
        const amountGHS = parseFloat(row['Amount (GHS)']) || 0;
        const location = cleanString(row['Location']);
        const vendorSupplier = cleanString(row['Vendor/Supplier']);
        const status = cleanString(row['STATUS']);
        const remarks = cleanString(row['Remarks']);
        const comments = cleanString(row['Comments']);
        const model = cleanString(row['Asset Class']);

        // Skip if no description or asset type
        if (!assetDescription || !assetType) {
          skipped++;
          continue;
        }

        // Check if item already exists by serial number
        const existingItem = await prisma.item.findUnique({
          where: { serialNumber },
        });

        if (existingItem) {
          skipped++;
          continue;
        }

        // Get or create category based on Asset Type
        let category = categoryCache[assetType];
        if (!category) {
          category = await prisma.category.findFirst({
            where: { title: assetType },
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                title: assetType,
                description: `${assetType} assets`,
              },
            });
          }
          categoryCache[assetType] = category;
        }

        // Get or create supplier
        let supplier = supplierCache[vendorSupplier] || defaultSupplier;
        if (vendorSupplier && vendorSupplier !== '' && !supplierCache[vendorSupplier]) {
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
                  supplierCode: `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                },
              });
            } catch (err) {
              // If supplier creation fails (duplicate code), use default
              supplier = defaultSupplier;
            }
          }
          supplierCache[vendorSupplier] = supplier;
        }

        // Check if location is a person or warehouse
        let assignedToPersonId = null;
        let warehouseId = defaultWarehouse.id;
        let currentLocationType = 'warehouse';

        if (location && location !== '') {
          // Check if person exists
          let person = peopleCache[location];
          if (!person) {
            person = await prisma.people.findFirst({
              where: { title: location },
            });
            if (person) {
              peopleCache[location] = person;
            }
          }

          if (person) {
            assignedToPersonId = person.id;
            currentLocationType = 'person';
          } else {
            // Check if it's a warehouse
            const warehouse = await prisma.warehouse.findFirst({
              where: { title: location },
            });

            if (warehouse) {
              warehouseId = warehouse.id;
            } else {
              // Create person for this location
              try {
                person = await prisma.people.create({
                  data: {
                    title: location,
                    status: 'active',
                  },
                });
                peopleCache[location] = person;
                assignedToPersonId = person.id;
                currentLocationType = 'person';
              } catch (err) {
                // If creation fails, keep as warehouse
                console.log(`⚠️  Could not create person for location: ${location}`);
              }
            }
          }
        }

        // Combine notes
        const notes = [remarks, comments, `Status: ${status}`]
          .filter(n => n && n !== '')
          .join('; ');

        // Create the item
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
            warehouseId,
            currentLocationType,
            assignedToPersonId,
            documentNumber: invoiceNumber,
            model,
            notes,
          },
        });

        created++;

        // Log progress every 100 items
        if ((i + 1) % 100 === 0) {
          console.log(`✅ Processed ${i + 1}/${data.length} items...`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error processing row ${i + 1}:`, error.message);
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

// Run the import
importData();
