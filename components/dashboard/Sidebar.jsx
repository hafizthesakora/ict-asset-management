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
      title: 'Warehouse Adjustments',
      href: '/dashboard/inventory/adjustments',
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
      title: 'JV Class',
      href: '/dashboard/inventory/units',
    },
    {
      title: 'Warehouses',
      href: '/dashboard/inventory/warehouse',
    },
    {
      title: 'Inventory Assignment',
      href: '/dashboard/inventory/assignments',
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

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen w-64 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-slate-700/50
        text-slate-50 
        shadow-2xl shadow-slate-900/20
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="relative z-50 flex h-full flex-col">
        {/* Header Section */}
        <header className="relative">
          <div className="flex items-center justify-between bg-slate-950/80 backdrop-blur-md border-b border-slate-700/30">
            <Link
              href="/dashboard"
              className="flex w-full items-center space-x-3 px-4 py-5 transition-all duration-200 hover:bg-slate-800/30"
            >
              <div className="rounded-lg bg-blue-600/20 p-2 ring-1 ring-blue-500/30">
                <FolderKanban className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
                EGH Asset
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              className="mr-3 rounded-md p-2 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white lg:hidden"
              onClick={() => setShowSidebar(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          <div className="space-y-2">
            {/* Home Link */}
            <Link
              className="group flex items-center space-x-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2.5 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/30"
              href="/dashboard/home/overview"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>

            {/* Inventory Dropdown */}
            <SidebarDropdownLink
              title="Inventory"
              items={inventoryLinks}
              icon={BaggageClaim}
              setShowSidebar={setShowSidebar}
            />

            {/* Other Navigation Links */}
            <div className="space-y-1 pt-2">
              <Link
                className="group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-slate-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
                href="/dashboard/inventory/purchases"
              >
                <ShoppingBasket className="h-4 w-4 transition-colors group-hover:text-blue-400" />
                <span className="font-medium">Call Offs</span>
              </Link>

              <Link
                className="group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-slate-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
                href="/dashboard/audit"
              >
                <Signal className="h-4 w-4 transition-colors group-hover:text-green-400" />
                <span className="font-medium">Audit Trail</span>
              </Link>

              <Link
                className="group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-slate-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
                href="/dashboard/documents"
              >
                <Files className="h-4 w-4 transition-colors group-hover:text-purple-400" />
                <span className="font-medium">Documents</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <footer className="border-t border-slate-700/30 bg-slate-950/50 backdrop-blur-md">
          <button
            className="group flex w-full items-center justify-center space-x-2 px-4 py-4 text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-white"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-200 ${
                showSidebar ? '' : 'rotate-180'
              }`}
            />
            <span className="text-sm font-medium">Collapse</span>
          </button>
        </footer>
      </div>
    </aside>
  );
}
