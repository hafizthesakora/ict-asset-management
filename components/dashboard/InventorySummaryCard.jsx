'use client';

import React, { useState } from 'react';
import { Warehouse, TrendingUp, MapPin, Package } from 'lucide-react';
import InventoryDetailPopup from './InventoryDetailPopup';

export default function InventorySummaryCard({ item, allData }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate stock level status
  const stockLevel = item.stockQty || 0;
  const getStockStatus = () => {
    if (stockLevel === 0)
      return {
        color: 'text-red-500',
        bg: 'bg-red-50',
        label: 'Empty',
        ring: 'ring-red-200',
      };
    if (stockLevel < 10)
      return {
        color: 'text-yellow-500',
        bg: 'bg-yellow-50',
        label: 'Low',
        ring: 'ring-yellow-200',
      };
    if (stockLevel < 50)
      return {
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        label: 'Medium',
        ring: 'ring-blue-200',
      };
    return {
      color: 'text-green-500',
      bg: 'bg-green-50',
      label: 'High',
      ring: 'ring-green-200',
    };
  };

  const stockStatus = getStockStatus();

  return (
    <>
      <div
        className="group relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/30 rounded-xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>

        <div
          className="relative bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md shadow-slate-900/5 border border-white/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/10 hover:-translate-y-0.5"
          onClick={() => setShowDetails(true)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${stockStatus.bg} ${stockStatus.ring} ring-1 transition-all duration-300 group-hover:scale-110`}
              >
                <Warehouse className={`h-5 w-5 ${stockStatus.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {item.title}
                </h3>
                {item.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              {stockStatus.label}
            </div>
          </div>

          {/* Stock quantity */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                Stock Quantity
              </p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {stockLevel}
                </span>
                <span className="text-sm text-slate-500 pb-1">units</span>
              </div>
            </div>

            {/* Trend indicator */}
            <div className="flex items-center gap-1 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Active</span>
            </div>
          </div>

          {/* Progress bar for stock level */}
          <div className="mb-4">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${
                  stockStatus.color === 'text-red-500'
                    ? 'from-red-400 to-red-500'
                    : stockStatus.color === 'text-yellow-500'
                    ? 'from-yellow-400 to-yellow-500'
                    : stockStatus.color === 'text-blue-500'
                    ? 'from-blue-400 to-blue-500'
                    : 'from-green-400 to-green-500'
                } rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min((stockLevel / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Additional info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {item.warehouseType && (
                <span className="capitalize">{item.warehouseType}</span>
              )}
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>Items</span>
              </div>
            </div>

            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors opacity-0 group-hover:opacity-100">
              View Details →
            </button>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {showDetails && (
        <InventoryDetailPopup
          warehouse={item}
          allData={allData}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
