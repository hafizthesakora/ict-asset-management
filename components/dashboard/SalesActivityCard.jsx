'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import SummaryPopup from './SummaryPopup';

export default function SalesActivityCard({ item, allData }) {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-md p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => setShowSummary(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-lg font-medium ${item.color}`}>
              {item.title}
            </h3>
            {/* <p className="text-sm text-gray-500">{item.unit}</p> */}
          </div>
          <div className="text-2xl font-bold">{item.number}</div>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href={item.href}
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
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
