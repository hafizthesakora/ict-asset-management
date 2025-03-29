import {
  Bell,
  ChevronDown,
  History,
  LayoutGrid,
  Plus,
  Settings,
  Users2,
} from 'lucide-react';
import React from 'react';
import SearchInput from './SearchInput';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="bg-gray-100 h-12 flex items-center justify-between px-8 border-b border-slate-200">
      <div className="flex gap-3">
        {/* Recent Activities  */}
        <button>
          <History className="w-6 h-6" />
        </button>

        {/* Search  */}
        <SearchInput />
      </div>
      <div className="flex items-center gap-3">
        {/* PlusIcon  */}
        <div className="pr-2 border-r border-gray-300">
          <button className="p-1 bg-blue-600 rounded-lg">
            <Plus className="text-slate-50 w-4 h-4" />
          </button>
        </div>
        <div className="flex border-r border-gray-300 space-x-2">
          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Users2 className="text-slate-900 w-4 h-4" />
          </button>

          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Bell className="text-slate-900 w-4 h-4" />
          </button>

          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Settings className="text-slate-900 w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center">
            <span>Hafiz</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button>
            <Image
              width={96}
              height={96}
              className="w-8 h-8 rounded-full border border-gray-800"
              alt="user-image"
              src="/2.png"
            />
          </button>
          <button>
            <LayoutGrid className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
