import React from 'react';

export default function InventorySummaryCard({ item }) {
  return (
    <div className="mb-4 shadow rounded-lg border border-slate-200 hover:border-blue-400 bg-white py-2 px-4 cursor-pointer flex items-center gap-3 justify-between transition-all duration-300">
      <h2 className="text-slate-500 uppercase">{item.title}</h2>
      <h4 className="text-2xl">{item.number}</h4>
    </div>
  );
}
