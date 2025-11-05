'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import FixedHeader from '@/components/dashboard/FixedHeader';
import Assigned from '@/components/dashboard/Assigned';
import ReturnedAsset from '@/components/dashboard/ReturnedAsset';

export default function AdjustmentsClient({
  addAdjustments,
  transferAdjustments,
  addColumns,
  transferColumns,
}) {
  const [activeForm, setActiveForm] = useState('add');

  const tabs = [
    {
      title: 'Returned Asset',
      icon: Plus,
      form: 'add',
    },
    {
      title: 'Assigned Asset',
      icon: Minus,
      form: 'transfer',
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <FixedHeader
        title="Assignment Management"
        newLink="/dashboard/inventory/adjustments/new"
      />

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 w-full max-w-7xl px-4 py-2 bg-white border mx-auto my-4 shadow rounded">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 items-center justify-center">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <li className="me-2" key={i}>
                <button
                  onClick={() => setActiveForm(tab.form)}
                  className={`${
                    activeForm === tab.form
                      ? 'inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group'
                      : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'
                  }`}
                >
                  <Icon className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                  {tab.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Content */}
      {activeForm === 'add' ? (
        <ReturnedAsset
          data={addAdjustments}
          columns={addColumns}
          resourceTitle="adjustments/add"
        />
      ) : (
        <Assigned
          data={transferAdjustments}
          columns={transferColumns}
          resourceTitle="adjustments/transfer"
        />
      )}
    </div>
  );
}
