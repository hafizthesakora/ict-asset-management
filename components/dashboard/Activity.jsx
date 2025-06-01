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
      bgColor: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      data: categories,
    },
    {
      title: 'Items',
      number: items.length,
      unit: 'Pkgs',
      href: '/dashboard/inventory/items',
      color: 'text-red-600',
      bgColor: 'from-red-500 to-red-600',
      lightBg: 'bg-red-50',
      iconBg: 'bg-red-100',
      data: items,
    },
    {
      title: 'Warehouses',
      number: warehouses.length,
      unit: 'Pkgs',
      href: '/dashboard/inventory/warehouse',
      color: 'text-green-600',
      bgColor: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      iconBg: 'bg-green-100',
      data: warehouses,
    },
    {
      title: 'Suppliers',
      number: suppliers.length,
      unit: 'Qty',
      href: '/dashboard/inventory/suppliers',
      color: 'text-orange-600',
      bgColor: 'from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      data: suppliers,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>

        <div className="relative container mx-auto px-4 py-8 space-y-12">
          {/* Activity Section */}
          <section className="relative">
            {/* Section header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Activity Overview
                </h2>
              </div>
              <p className="text-slate-600 ml-7">
                Real-time overview of your inventory management system
              </p>
            </div>

            {/* Activity cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {salesActivity.map((item, i) => (
                <SalesActivityCard item={item} allData={allData} key={i} />
              ))}
            </div>
          </section>

          {/* Inventory Summary Section */}
          <section className="relative">
            {/* Section header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Inventory Summary
                </h2>
              </div>
              <p className="text-slate-600 ml-7">
                Warehouse stock levels and distribution overview
              </p>
            </div>

            {/* Inventory cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {warehouses.map((warehouse, i) => (
                <InventorySummaryCard
                  key={i}
                  item={warehouse}
                  allData={allData}
                />
              ))}
            </div>

            {/* Empty state */}
            {warehouses.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg
                    className="h-12 w-12 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  No warehouses found
                </h3>
                <p className="text-slate-500">
                  Get started by creating your first warehouse
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
