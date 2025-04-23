// pages/api/analytics.js (Next.js Pages Router)
// or
// app/api/analytics/route.js (Next.js App Router)

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// For Next.js App Router
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') || 'month';

  try {
    const analyticsData = await getAnalyticsData(timeframe);
    return new Response(JSON.stringify(analyticsData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch analytics data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// For Next.js Pages Router
/*
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { timeframe = 'month' } = req.query;

  try {
    const analyticsData = await getAnalyticsData(timeframe);
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}
*/

async function getAnalyticsData(timeframe) {
  // Calculate date range based on timeframe
  const now = new Date();
  let startDate = new Date();

  switch (timeframe) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  // 1. Category Distribution
  const categories = await prisma.category.findMany({
    include: {
      items: {
        select: {
          quantity: true,
          buyingPrice: true,
        },
      },
    },
  });

  const categoryDistribution = categories
    .map((category) => {
      const count = category.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const value = category.items.reduce(
        (sum, item) => sum + item.quantity * (item.buyingPrice || 0),
        0
      );

      return {
        title: category.title,
        count,
        value,
      };
    })
    .sort((a, b) => b.count - a.count);

  // 2. Warehouse Occupancy
  const warehouses = await prisma.warehouse.findMany();

  const warehouseOccupancy = warehouses.map((warehouse) => {
    // For capacity, we'll use stockQty + 30% as a placeholder
    // In a real app, you might want to add a capacity field to your schema
    const capacity = Math.round(warehouse.stockQty * 1.3);

    return {
      title: warehouse.title,
      stockQty: warehouse.stockQty,
      capacity,
    };
  });

  // 3. Inventory Value over Time
  // For historical data, we need to calculate based on adjustments
  // This is a simplified approach - for real historical tracking, you'd need a history table
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const addAdjustments = await prisma.addStockAdjustment.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
    },
    include: {
      item: {
        select: {
          buyingPrice: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const transferAdjustments = await prisma.transferStockAdjustment.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
    },
    include: {
      item: {
        select: {
          buyingPrice: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Calculate current total value
  const items = await prisma.item.findMany({
    select: {
      quantity: true,
      buyingPrice: true,
    },
  });

  const currentValue = items.reduce(
    (sum, item) => sum + item.quantity * (item.buyingPrice || 0),
    0
  );

  // Create month buckets
  const months = [];
  let monthlyValue = currentValue;

  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.unshift(date.toLocaleString('default', { month: 'short' }));
  }

  // Build inventory value trend (working backwards from current value)
  const inventoryValue = [];
  for (let i = months.length - 1; i >= 0; i--) {
    inventoryValue.unshift({
      month: months[i],
      value: Math.round(monthlyValue),
    });

    // Adjust value for previous month (working backwards)
    if (i > 0) {
      const monthStart = new Date();
      monthStart.setMonth(now.getMonth() - (5 - i));
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      // Calculate adjustments for this month
      const monthAdds = addAdjustments.filter(
        (adj) => adj.createdAt >= monthStart && adj.createdAt < monthEnd
      );

      const monthTransfers = transferAdjustments.filter(
        (adj) => adj.createdAt >= monthStart && adj.createdAt < monthEnd
      );

      // Subtract additions from this month (since we're going backwards)
      monthlyValue -= monthAdds.reduce(
        (sum, adj) => sum + adj.addStockQty * (adj.item.buyingPrice || 0),
        0
      );

      // We don't need to adjust for transfers as they don't change total value
    }
  }

  // 4. Stock Movement
  const stockMovementMap = new Map();

  // Process last 4 months of data
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthLabel = `${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(date.getFullYear()).slice(2)}`;

    stockMovementMap.set(monthLabel, {
      date: monthLabel,
      additions: 0,
      transfers: 0,
    });
  }

  // Add the adjustments data
  addAdjustments.forEach((adj) => {
    const date = adj.createdAt;
    const monthLabel = `${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(date.getFullYear()).slice(2)}`;

    if (stockMovementMap.has(monthLabel)) {
      const data = stockMovementMap.get(monthLabel);
      data.additions += adj.addStockQty;
    }
  });

  transferAdjustments.forEach((adj) => {
    const date = adj.createdAt;
    const monthLabel = `${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(date.getFullYear()).slice(2)}`;

    if (stockMovementMap.has(monthLabel)) {
      const data = stockMovementMap.get(monthLabel);
      data.transfers += adj.transferStockQty;
    }
  });

  const stockMovement = Array.from(stockMovementMap.values()).reverse();

  // 5. Top Suppliers
  const suppliers = await prisma.supplier.findMany({
    include: {
      items: {
        select: {
          quantity: true,
          buyingPrice: true,
        },
      },
    },
  });

  const topSuppliers = suppliers
    .map((supplier) => {
      const itemCount = supplier.items.length;
      const totalValue = supplier.items.reduce(
        (sum, item) => sum + item.quantity * (item.buyingPrice || 0),
        0
      );

      return {
        title: supplier.title,
        itemCount,
        totalValue,
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5); // Top 5 suppliers

  // 6. Stock Transfers by Month
  const stockTransfersMap = new Map();

  months.forEach((month) => {
    stockTransfersMap.set(month, { month, count: 0 });
  });

  transferAdjustments.forEach((adj) => {
    const month = adj.createdAt.toLocaleString('default', { month: 'short' });
    if (stockTransfersMap.has(month)) {
      stockTransfersMap.get(month).count += adj.transferStockQty;
    }
  });

  const stockTransfers = Array.from(stockTransfersMap.values());

  // 7. People Assignments by Department
  const people = await prisma.people.findMany({
    include: {
      transferStockAdjustments: true,
    },
  });

  const departmentMap = new Map();

  people.forEach((person) => {
    const department = person.department || 'Other';

    if (!departmentMap.has(department)) {
      departmentMap.set(department, 0);
    }

    departmentMap.set(
      department,
      departmentMap.get(department) + person.transferStockAdjustments.length
    );
  });

  const peopleAssignments = Array.from(departmentMap.entries())
    .map(([department, count]) => ({ department, count }))
    .filter((item) => item.count > 0);

  return {
    categoryDistribution,
    warehouseOccupancy,
    inventoryValue,
    stockMovement,
    topSuppliers,
    stockTransfers,
    peopleAssignments,
  };
}
