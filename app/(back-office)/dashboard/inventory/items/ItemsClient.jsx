'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import FixedHeader from '@/components/dashboard/FixedHeader';
import DataTable from '@/components/dashboard/DataTable';

export default function ItemsClient({ initialItems, columns }) {
  const [items, setItems] = useState(initialItems);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBatchUpload = async () => {
    if (!file) return;
    setLoading(true);

    // 1) read file into an ArrayBuffer
    const buffer = await file.arrayBuffer();
    // 2) parse with SheetJS
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // 3) POST each row to your items API
    const baseUrl = 'http://localhost:3000';
    for (const row of rows) {
      await fetch(`${baseUrl}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      });
    }

    setLoading(false);
    // 4) refresh the list
    router.refresh();
  };

  return (
    <div className="h-full flex flex-col">
      <FixedHeader title="Items" newLink="/dashboard/inventory/items/new" />

      <div className="px-8 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     max-w-xs"
          />
          <button
            onClick={handleBatchUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     whitespace-nowrap"
          >
            {loading ? 'Uploading…' : 'Batch Upload'}
          </button>
        </div>
      </div>

      {/* DataTable container with proper overflow handling */}
      <div className="flex-1 px-8 pb-8 overflow-hidden">
        <div className="h-full overflow-auto">
          <DataTable data={items} columns={columns} resourceTitle="items" />
        </div>
      </div>
    </div>
  );
}
