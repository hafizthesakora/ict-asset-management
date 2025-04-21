'use client';

import { CreditCard, X } from 'lucide-react';
import React, { useState } from 'react';

export default function DashboardBanner() {
  const [hidden, setHidden] = useState(false);
  return (
    <div
      className={`${
        hidden
          ? 'hidden'
          : 'hidden lg:grid grid-cols-12 items-center py-6 px-16 bg-white gap-4 relative'
      }`}
    >
      {/* ICON */}
      <div className="col-span-2">
        <CreditCard className="w-16 h-16 text-slate-500" />
      </div>

      {/* Text */}
      <div className="col-span-6">
        <h2 className="font-bold text-2xl">Eni Ghana ICT Asset Management.</h2>
        <p>
          Lets track all our Assigned, Unassigned, Stolen, Damaged and newly
          Purchased Assets of Eni Ghana.
        </p>
      </div>

      {/* Button */}
      <div className="col-span-3">
        <button className="py-2.5 px-8 uppercase bg-blue-500 text-white rounded-lg">
          Get Started
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setHidden(true)}
        className="absolute top-4 right-16"
      >
        <X className="text-slate-600" />
      </button>
    </div>
  );
}
