import {
  BaggageClaim,
  Cable,
  ChevronLeft,
  Files,
  FolderKanban,
  Home,
  ShoppingBag,
  ShoppingBasket,
  Signal,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-800 text-slate-50 justify-between fixed">
      {/* TOP PART */}

      <div className="flex flex-col">
        {/* LOGO */}
        <Link
          href=""
          className="bg-slate-950 py-4 px-2 flex space-x-2 items-center"
        >
          <FolderKanban />
          <span className="text-2xl font-semibold">Inventory</span>
        </Link>

        {/* LINKS */}

        <nav className="flex flex-col gap-3 px-3 py-6">
          <Link
            className="flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md"
            href=""
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <button className="p-2 flex items-center space-x-2">
            <BaggageClaim className="w-4 h-4" />
            <span>Inventory</span>
          </button>
          <button className="p-2 flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Assigned</span>
          </button>
          <button className="p-2 flex items-center space-x-2">
            <ShoppingBasket className="w-4 h-4" />
            <span>Purchases</span>
          </button>
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
