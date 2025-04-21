import { Check, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import SalesActivityCard from './SalesActivityCard';
import InventorySummaryCard from './InventorySummaryCard';
import { getData } from '@/lib/getData';

export default async function Activity() {
  const categoriesData = getData('categories');
  const itemsData = getData('items');
  const warehousesData = getData('warehouse');
  const suppliersData = getData('suppliers');

  //Note: This is called Parallel fetching, it uses the Promise.all approach hence all the data is fetched at once.
  const [categories, items, warehouses, suppliers] = await Promise.all([
    categoriesData,
    itemsData,
    warehousesData,
    suppliersData,
  ]);

  const inventorySummary = warehouses.map((item, i) => {
    return {
      title: item.title,
      number: item.stockQty,
    };
  });
  const salesActivity = [
    {
      title: 'Categories',
      number: categories.length,
      unit: 'Qty',
      href: '/dashboard/inventory/categories',
      color: 'text-blue-600',
    },
    {
      title: 'Items',
      number: items.length,
      unit: 'Pkgs',
      href: '/dashboard/inventory/items',
      color: 'text-red-600',
    },
    {
      title: 'Warehouses',
      number: warehouses.length,
      unit: 'Pkgs',
      href: '/dashboard/inventory/warehouse',
      color: 'text-green-600',
    },
    {
      title: 'Suppliers',
      number: suppliers.length,
      unit: 'Qty',
      href: '/dashboard/inventory/suppliers',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-blue-50 border-b border-slate-300 grid grid-cols-12 gap-4">
      {/* ACTIVITY */}
      <div className="col-span-full lg:col-span-8 border-r border-slate-300 p-8 py-16 lg:py-8">
        <h2 className="mb-6 text-xl">Activity</h2>
        <div className="pr-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {salesActivity.map((item, i) => (
            <SalesActivityCard item={item} key={i} />
          ))}
          {/* CARD */}
        </div>
      </div>

      {/* INVENTORY SUMMARY */}
      <div className="col-span-full lg:col-span-4 p-8">
        <h2 className="mb-6 text-xl">Inventory Summary</h2>
        <div className="">
          {inventorySummary.map((item, i) => (
            <InventorySummaryCard item={item} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
