import React from 'react';
import SalesActivityCard from './SalesActivityCard';
import InventorySummaryCard from './InventorySummaryCard';
import { getData } from '@/lib/getData';

export default async function Activity() {
  // Parallel fetching of data
  const categoriesData = getData('categories');
  const itemsData = getData('items');
  const warehousesData = getData('warehouse');
  const suppliersData = getData('suppliers');

  const [categories, items, warehouses, suppliers] = await Promise.all([
    categoriesData,
    itemsData,
    warehousesData,
    suppliersData,
  ]);

  const allData = { categories, items, warehouses, suppliers };

  const salesActivity = [
    {
      title: 'Categories',
      number: categories.length,
      unit: 'Qty',
      href: '/dashboard/inventory/categories',
      color: 'text-blue-600',
      data: categories,
    },
    {
      title: 'Items',
      number: items.length,
      unit: 'Pkgs',
      href: '/dashboard/inventory/items',
      color: 'text-red-600',
      data: items,
    },
    {
      title: 'Warehouses',
      number: warehouses.length,
      unit: 'Pkgs',
      href: '/dashboard/inventory/warehouse',
      color: 'text-green-600',
      data: warehouses,
    },
    {
      title: 'Suppliers',
      number: suppliers.length,
      unit: 'Qty',
      href: '/dashboard/inventory/suppliers',
      color: 'text-orange-600',
      data: suppliers,
    },
  ];

  return (
    <div className="bg-blue-50 border-b border-slate-300 grid grid-cols-12 gap-4">
      {/* Activity Section */}
      <div className="col-span-full border-r border-slate-300 p-8 py-16 lg:py-8">
        <h2 className="mb-6 text-xl">Activity</h2>
        <div className="pr-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {salesActivity.map((item, i) => (
            <SalesActivityCard item={item} allData={allData} key={i} />
          ))}
        </div>
      </div>

      {/* Inventory Summary Section */}
      <div className="col-span-full border-r border-slate-300 p-8 py-16 lg:py-8">
        <h2 className="mb-6 text-xl">Inventory Summary</h2>
        <div className="pr-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {warehouses.map((warehouse, i) => (
            <InventorySummaryCard key={i} item={warehouse} allData={allData} />
          ))}
        </div>
      </div>
    </div>
  );
}
