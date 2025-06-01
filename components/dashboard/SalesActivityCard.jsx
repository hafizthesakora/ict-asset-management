'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { TrendingUp, Package, Building2, Users, Tag } from 'lucide-react';
import SummaryPopup from './SummaryPopup';

const iconMap = {
  Categories: Tag,
  Items: Package,
  Warehouses: Building2,
  Suppliers: Users,
};

export default function SalesActivityCard({ item, allData }) {
  const [showSummary, setShowSummary] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = iconMap[item.title] || Package;

  return (
    <>
      <div
        className="group relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>

        <div
          className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-slate-900/5 border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1"
          onClick={() => setShowSummary(true)}
        >
          {/* Header with icon */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl ${item.iconBg} transition-all duration-300 group-hover:scale-110`}
            >
              <IconComponent className={`h-6 w-6 ${item.color}`} />
            </div>
            <div className="flex items-center gap-1 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Live</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
              {item.title}
            </h3>

            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {item.number}
              </span>
              <span className="text-sm text-slate-500 pb-1">{item.unit}</span>
            </div>
          </div>

          {/* Progress bar simulation */}
          <div className="mt-4 mb-4">
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${
                  item.bgColor
                } rounded-full transition-all duration-1000 ${
                  isHovered ? 'w-full' : 'w-0'
                }`}
              ></div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Link
              href={item.href}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group/link"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
              <svg
                className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              View Summary
            </button>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {showSummary && (
        <SummaryPopup
          title={item.title}
          data={item.data}
          items={allData.items}
          categories={allData.categories}
          warehouses={allData.warehouses}
          suppliers={allData.suppliers}
          onClose={() => setShowSummary(false)}
        />
      )}
    </>
  );
}
