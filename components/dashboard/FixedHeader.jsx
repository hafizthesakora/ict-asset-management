'use client';
import {
  HelpCircle,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function FixedHeader({ newLink, title }) {
  const [activeLayout, setActiveLayout] = useState('list');

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center py-4 px-6 lg:px-8">
        {/* Title Section */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400 font-medium">
            Manage your {title.toLowerCase()}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* New Button */}
          <Link
            href={newLink}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     dark:focus:ring-offset-gray-900 group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">Add New</span>
            <span className="sm:hidden">New</span>
          </Link>

          {/* Layout Toggle */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex items-center shadow-inner">
            <button
              onClick={() => setActiveLayout('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                activeLayout === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayout('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                activeLayout === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                       text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                       rounded-lg transition-all duration-200 shadow-sm hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              title="More Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Help Button */}
          <button
            className="p-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                     text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 
                     focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
            title="Get Help"
          >
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Only visible on small screens */}
      <div className="sm:hidden px-6 pb-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            View Options
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveLayout('list')}
              className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                activeLayout === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveLayout('grid')}
              className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                activeLayout === 'grid'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
