const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to parse dates from Excel
function parseExcelDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.toString().split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return new Date();
}

// Helper function to clean string
function cleanString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/\r\n|\r|\n/g, ' ');
}

async function importData() {
  try {
    console.log('🚀 Starting optimized Excel data import...\n');

    // Read Excel file
    const workbook = XLSX.readFile('/Users/macbook/Desktop/Copy of 2025 Asset Reconciliation-ICT (version 1).xlsx');
    const sheet = workbook.Sheets['Outstanding'];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    console.log(`📊 Found ${data.length} rows to import\n`);

    // Setup defaults
    console.log('🔧 Setting up default entities...');

    let defaultUnit = await prisma.unit.findFirst();
    if (!defaultUnit) {
      defaultUnit = await prisma.unit.create({
        data: { title: 'Unit', abbreviation: 'Unit' },
      });
    }

    let defaultBrand = await prisma.brand.findFirst();
    if (!defaultBrand) {
      defaultBrand = await prisma.brand.create({
        data: { title: 'Unknown Brand' },
      });
    }

    let defaultWarehouse = await prisma.warehouse.findFirst();
    if (!defaultWarehouse) {
      defaultWarehouse = await prisma.warehouse.create({
        data: {
          title: 'Main Warehouse',
          location: 'Default Location',
          warehouseType: 'main',
        },
      });
    }

    let defaultSupplier = await prisma.supplier.findFirst();
    if (!defaultSupplier) {
      defaultSupplier = await prisma.supplier.create({
        data: {
          title: 'Unknown Supplier',
          supplierCode: 'SUP-DEFAULT-001',
        },
      });
    }

    console.log('✅ Default entities ready\n');

    // Pre-load all existing data to avoid repeated queries
    console.log('📥 Loading existing data...');
    const existingItems = await prisma.item.findMany({ select: { serialNumber: true } });
    const existingSerials = new Set(existingItems.map(i => i.serialNumber));

    const existingCategories = await prisma.category.findMany();
    const categoryMap = new Map(existingCategories.map(c => [c.title, c]));

    const existingSuppliers = await prisma.supplier.findMany();
    const supplierMap = new Map(existingSuppliers.map(s => [s.title, s]));

    const existingPeople = await prisma.people.findMany();
    const peopleMap = new Map(existingPeople.map(p => [p.title, p]));

    console.log(`✅ Loaded ${existingSerials.size} existing items\n`);

    console.log('📦 Processing items...\n');

    let created = 0;
    let skipped = 0;
    let errors = 0;
    const batchSize = 50;
    let batch = [];

    // Track new entities to create
    const newCategories = new Map();
    const newSuppliers = new Map();
    const newPeople = new Map();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        const assetTag = cleanString(row['Identification \r\nNumber ']);
        const assetDescription = cleanString(row['Asset Description']);
        const serialNumber = cleanString(row['Serial Number']) || `AUTO-${assetTag || Date.now()}-${i}`;
        const assetType = cleanString(row['Asset Type']);
        const amountGHS = parseFloat(row['Amount (GHS)']) || 0;
        const location = cleanString(row['Location']);
        const vendorSupplier = cleanString(row['Vendor/Supplier']);
        const status = cleanString(row['STATUS']);
        const model = cleanString(row['Asset Class']);

        // Skip if no description
        if (!assetDescription || !assetType) {
          skipped++;
          continue;
        }

        // Skip if already exists
        if (existingSerials.has(serialNumber)) {
          skipped++;
          continue;
        }

        // Get or queue category
        let category = categoryMap.get(assetType);
        if (!category && !newCategories.has(assetType)) {
          newCategories.set(assetType, {
            title: assetType,
            description: `${assetType} assets`,
          });
        }

        // Get or queue supplier
        let supplier = defaultSupplier;
        if (vendorSupplier && vendorSupplier !== '') {
          supplier = supplierMap.get(vendorSupplier);
          if (!supplier && !newSuppliers.has(vendorSupplier)) {
            newSuppliers.set(vendorSupplier, {
              title: vendorSupplier,
              supplierCode: `SUP-${Date.now()}-${newSuppliers.size}`,
            });
          }
        }

        // Get or queue person
        let person = null;
        if (location && location !== '') {
          person = peopleMap.get(location);
          if (!person && !newPeople.has(location)) {
            newPeople.set(location, {
              title: location,
              status: 'active',
            });
          }
        }

        // Create item data
        const itemData = {
          title: assetDescription,
          description: assetDescription,
          categoryId: category?.id || null,
          serialNumber,
          barcode: serialNumber,
          quantity: 1,
          unitId: defaultUnit.id,
          brandId: defaultBrand.id,
          assetTag,
          buyingPrice: amountGHS,
          supplierId: supplier.id,
          warehouseId: defaultWarehouse.id,
          currentLocationType: person ? 'person' : 'warehouse',
          assignedToPersonId: person?.id || null,
          documentNumber: cleanString(row['Invoice Number']),
          model,
          notes: `Status: ${status}; ${cleanString(row['Remarks'])}; ${cleanString(row['Comments'])}`,
        };

        batch.push({ data: itemData, pendingCategory: assetType, pendingSupplier: vendorSupplier, pendingPerson: location });

        // Process batch
        if (batch.length >= batchSize || i === data.length - 1) {
          // Create new categories
          if (newCategories.size > 0) {
            const categoriesToCreate = Array.from(newCategories.values());
            const createdCategories = await prisma.category.createMany({
              data: categoriesToCreate,
              skipDuplicates: true,
            });

            // Reload categories
            const reloadedCategories = await prisma.category.findMany({
              where: { title: { in: Array.from(newCategories.keys()) } },
            });
            reloadedCategories.forEach(c => categoryMap.set(c.title, c));
            newCategories.clear();
          }

          // Create new suppliers
          if (newSuppliers.size > 0) {
            for (const [name, data] of newSuppliers.entries()) {
              try {
                const created = await prisma.supplier.create({ data });
                supplierMap.set(name, created);
              } catch (err) {
                // Duplicate, reload
                const existing = await prisma.supplier.findFirst({ where: { title: name } });
                if (existing) supplierMap.set(name, existing);
              }
            }
            newSuppliers.clear();
          }

          // Create new people
          if (newPeople.size > 0) {
            for (const [name, data] of newPeople.entries()) {
              try {
                const created = await prisma.people.create({ data });
                peopleMap.set(name, created);
              } catch (err) {
                const existing = await prisma.people.findFirst({ where: { title: name } });
                if (existing) peopleMap.set(name, existing);
              }
            }
            newPeople.clear();
          }

          // Update batch with correct IDs
          for (const item of batch) {
            if (item.pendingCategory) {
              const cat = categoryMap.get(item.pendingCategory);
              if (cat) item.data.categoryId = cat.id;
            }
            if (item.pendingSupplier) {
              const sup = supplierMap.get(item.pendingSupplier);
              if (sup) item.data.supplierId = sup.id;
            }
            if (item.pendingPerson) {
              const per = peopleMap.get(item.pendingPerson);
              if (per) {
                item.data.assignedToPersonId = per.id;
                item.data.currentLocationType = 'person';
              }
            }
          }

          // Create items
          for (const item of batch) {
            try {
              if (item.data.categoryId) {
                await prisma.item.create({ data: item.data });
                created++;
              } else {
                skipped++;
              }
            } catch (err) {
              errors++;
            }
          }

          batch = [];
          console.log(`✅ Processed ${i + 1}/${data.length} items (Created: ${created}, Skipped: ${skipped}, Errors: ${errors})`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error at row ${i + 1}:`, error.message);
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
