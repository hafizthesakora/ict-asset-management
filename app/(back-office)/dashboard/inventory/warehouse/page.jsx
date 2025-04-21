import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import React from 'react';

export default async function Warehouse() {
  const warehouse = await getData('warehouse');
  const columns = ['title', 'warehouseType', 'location', 'description'];
  return (
    <div>
      {/* HEAdER */}
      <FixedHeader
        title="Warehouse"
        newLink="/dashboard/inventory/warehouse/new"
      />
      {/* Table */}
      <div className="my-4 p-8">
        <DataTable
          data={warehouse}
          columns={columns}
          resourceTitle="warehouse"
        />
      </div>
    </div>
  );
}
