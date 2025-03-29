import { Check, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import SalesActivityCard from './SalesActivityCard';
import InventorySummaryCard from './InventorySummaryCard';

export default function Activity() {
  const salesActivity = [
    {
      title: 'To be Assigned',
      number: 10,
      unit: 'Qty',
      href: '#',
      color: 'text-blue-600',
    },
    {
      title: 'To be Prepared',
      number: 10,
      unit: 'Pkgs',
      href: '#',
      color: 'text-red-600',
    },
    {
      title: 'To be Delivered',
      number: 10,
      unit: 'Pkgs',
      href: '#',
      color: 'text-green-600',
    },
    {
      title: 'To be Invoiced',
      number: 10,
      unit: 'Qty',
      href: '#',
      color: 'text-orange-600',
    },
  ];
  const inventorySummary = [
    {
      title: 'Quantity in Hand',
      number: 10,
    },
    {
      title: 'Quantity to be Recieved',
      number: 0,
    },
  ];
  return (
    <div className="bg-blue-50 border-b border-slate-300 grid grid-cols-12 gap-4">
      {/* ACTIVITY */}
      <div className="col-span-8 border-r border-slate-300 p-8">
        <h2 className="mb-6 text-xl">Activity</h2>
        <div className="pr-8 grid grid-cols-4 gap-4">
          {salesActivity.map((item, i) => (
            <SalesActivityCard item={item} key={i} />
          ))}
          {/* CARD */}
        </div>
      </div>

      {/* INVENTORY SUMMARY */}
      <div className="col-span-4 p-8">
        <h2 className="mb-6 text-xl">Inventory Summary</h2>
        <div className="">
          {inventorySummary.map((item, i) => (
            <InventorySummaryCard item={item} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
