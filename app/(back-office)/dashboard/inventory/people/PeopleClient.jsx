'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import FixedHeader from '@/components/dashboard/FixedHeader';
import DataTable from '@/components/dashboard/DataTable';

export default function PeopleClient({ initialItems, columns }) {
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
      await fetch(`${baseUrl}/api/people`, {
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
    <div>
      <FixedHeader title="People" newLink="/dashboard/inventory/people/new" />

      <div className="flex items-center p-4 space-x-4">
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleBatchUpload}
          disabled={!file || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Uploading…' : 'Batch Upload'}
        </button>
      </div>

      <div className="my-4 p-8">
        <DataTable data={items} columns={columns} resourceTitle="people" />
      </div>
    </div>
  );
}
