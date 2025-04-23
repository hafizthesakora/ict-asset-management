'use client';
import {
  BaggageClaim,
  Cable,
  ChevronLeft,
  Files,
  FolderKanban,
  Home,
  PersonStanding,
  PlusCircle,
  ShoppingBag,
  ShoppingBasket,
  Signal,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import SidebarDropdownLink from './SidebarDropdownLink';

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const inventoryLinks = [
    {
      title: 'All Items',
      href: '/dashboard/inventory',
    },
    {
      title: 'Items',
      href: '/dashboard/inventory/items',
    },
    {
      title: 'Categories',
      href: '/dashboard/inventory/categories',
    },
    {
      title: 'Brands',
      href: '/dashboard/inventory/brands',
    },
    {
      title: 'Assets Class',
      href: '/dashboard/inventory/units',
    },
    {
      title: 'Warehouses',
      href: '/dashboard/inventory/warehouse',
    },
    {
      title: 'Inventory Adjustments',
      href: '/dashboard/inventory/adjustments',
    },
    {
      title: 'Suppliers',
      href: '/dashboard/inventory/suppliers',
    },
    {
      title: 'Employees',
      href: '/dashboard/inventory/people',
    },
  ];

  const salesLink = [
    {
      title: 'Customers',
      href: '',
    },
    {
      title: 'Sales Orders',
      href: '',
    },
    {
      title: 'Packages',
      href: '',
    },
    {
      title: 'Shipments',
      href: '',
    },
    {
      title: 'Invoices',
      href: '',
    },
    {
      title: 'Sales Receipts',
      href: '',
    },
    {
      title: 'Payment Received',
      href: '',
    },
    {
      title: 'Sales Returns',
      href: '',
    },
    {
      title: 'Credit Notes',
      href: '',
    },
  ];
  return (
    <div
      className={`${
        showSidebar
          ? 'w-64 min-h-screen bg-slate-800 text-slate-50 justify-between fixed lg:block z-50'
          : 'w-64 min-h-screen bg-slate-800 text-slate-50 justify-between fixed hidden lg:block z-50'
      }`}
    >
      {/* TOP PART */}

      <div className="flex flex-col">
        {/* LOGO */}
        <div className="flex justify-between">
          <Link
            href=""
            className="bg-slate-950 py-4 px-2 flex space-x-2 items-center w-full"
          >
            <FolderKanban />
            <span className="text-2xl font-semibold">egh asset</span>
          </Link>
          <button
            className="bg-slate-950 px-2 py-3 lg:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* LINKS */}

        <nav className="flex flex-col gap-3 px-3 py-6">
          <Link
            className="flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md"
            href="/dashboard/home/overview"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <SidebarDropdownLink
            title="Inventory"
            items={inventoryLinks}
            icon={BaggageClaim}
            setShowSidebar={setShowSidebar}
          />

          {/* <SidebarDropdownLink
            title="Sales"
            items={salesLink}
            icon={ShoppingBasket}
            setShowSidebar={setShowSidebar}
          /> */}

          <Link
            className="p-2 flex items-center space-x-2"
            href="/dashboard/inventory/purchases"
          >
            <ShoppingBasket className="w-4 h-4" />
            <span>Call Offs</span>
          </Link>
          <Link className="p-2 flex items-center space-x-2" href="">
            <Cable className="w-4 h-4" />
            <span>Integrations</span>
          </Link>
          <Link className="p-2 flex items-center space-x-2" href="">
            <Signal className="w-4 h-4" />
            <span>Reports</span>
          </Link>
          <Link className="p-2 flex items-center space-x-2" href="">
            <Files className="w-4 h-4" />
            <span>Documents</span>
          </Link>
        </nav>
      </div>

      {/* BOTTOM PART */}
      <div className="flex flex-col">
        <button className="bg-slate-950 justify-center py-4 px-2 flex space-x-2 items-center">
          <ChevronLeft />
        </button>
      </div>

      {/* FOOTER */}
    </div>
  );
}
