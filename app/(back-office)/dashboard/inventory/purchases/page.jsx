import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import React from 'react';

export default async function CallOff() {
  const purchases = await getData('purchases');
  const columns = [
    'referenceNumber',
    'quantity',
    'products',
    'notes',
    'supplier.title',
    'status',
    'createdAt',
  ];
  return (
    <div>
      {/* HEAdER */}
      <FixedHeader title="Purchases" newLink="/dashboard/purchases/new" />
      {/* Table */}
      <div className="my-4 p-8">
        <DataTable
          data={purchases}
          columns={columns}
          resourceTitle="purchases"
        />
      </div>
    </div>
  );
}
