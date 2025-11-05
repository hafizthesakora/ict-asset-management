'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import FixedHeader from '@/components/dashboard/FixedHeader';
import DataTable from '@/components/dashboard/DataTable';
import PeopleDetailPopup from '@/components/dashboard/PeopleDetailPopup';

export default function PeopleClient({ initialItems, columns }) {
  const [items, setItems] = useState(initialItems || []);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
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
    // const baseUrl = 'http://localhost:3000';
    for (const row of rows) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      });
    }

    setLoading(false);
    // 4) refresh the list
    router.refresh();
  };

  const handleViewDetails = async (personId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/people/${personId}`
      );
      const personData = await response.json();
      setSelectedPerson(personData);
      setShowDetailPopup(true);
    } catch (error) {
      console.error('Error fetching person details:', error);
    }
  };

  const handleClosePopup = () => {
    setShowDetailPopup(false);
    setSelectedPerson(null);
  };

  // Ensure items is an array and enhance data with action buttons
  const safeItems = Array.isArray(items) ? items : [];
  const enhancedItems = safeItems.map((person) => {
    // Calculate days until contract end
    let daysUntilEnd = null;
    if (person.contractEndDate) {
      const endDate = new Date(person.contractEndDate);
      const today = new Date();
      const diffTime = endDate - today;
      daysUntilEnd = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Check if contract is expired and user is not demobilized
    const isExpiredNotDemobbed = daysUntilEnd !== null && daysUntilEnd <= 0 && person.status !== 'inactive';

    return {
      ...person,
      contractStatus: daysUntilEnd !== null ? (
        <div className="flex items-center gap-2">
          {isExpiredNotDemobbed && (
            <AlertTriangle className="text-red-600 animate-pulse" size={18} />
          )}
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              daysUntilEnd <= 0
                ? person.status === 'inactive'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800 ring-2 ring-red-600'
                : daysUntilEnd <= 30
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {daysUntilEnd <= 0
              ? person.status === 'inactive'
                ? 'Demobilized'
                : `EXPIRED ${Math.abs(daysUntilEnd)}d ago`
              : daysUntilEnd <= 30
              ? `${daysUntilEnd} days left`
              : 'Active'}
          </span>
        </div>
      ) : (
        <span className="text-xs text-gray-500">No end date</span>
      ),
      actions: (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(person.id)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors duration-200"
          >
            View Items
          </button>
          <button
            onClick={() => router.push(`/dashboard/inventory/people/${person.id}`)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200"
          >
            Profile
          </button>
        </div>
      ),
    };
  });

  // Enhanced columns with actions and contract status
  const safeColumns = Array.isArray(columns) ? columns : [];
  const enhancedColumns = [...safeColumns, 'contractStatus', 'actions'];

  // Count employees with expired contracts that haven't been demobilized
  const expiredNotDemobbed = safeItems.filter((person) => {
    if (!person.contractEndDate || person.status === 'inactive') return false;
    const endDate = new Date(person.contractEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const daysUntilEnd = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysUntilEnd <= 0;
  });

  return (
    <div>
      <FixedHeader title="People" newLink="/dashboard/inventory/people/new" />

      {/* Expired Contracts Alert */}
      {expiredNotDemobbed.length > 0 && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900">
                Expired Contracts Require Attention
              </h3>
              <p className="text-sm text-red-800 mt-1">
                {expiredNotDemobbed.length} employee{expiredNotDemobbed.length !== 1 ? 's have' : ' has'} expired contract{expiredNotDemobbed.length !== 1 ? 's' : ''} and need{expiredNotDemobbed.length === 1 ? 's' : ''} to be demobilized.
              </p>
              <button
                onClick={() => router.push('/dashboard/demob-user')}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Go to Demob User
              </button>
            </div>
          </div>
        </div>
      )}

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
        <DataTable
          data={enhancedItems}
          columns={enhancedColumns}
          resourceTitle="people"
        />
      </div>

      {/* Detail Popup */}
      {showDetailPopup && selectedPerson && (
        <PeopleDetailPopup person={selectedPerson} onClose={handleClosePopup} />
      )}
    </div>
  );
}
