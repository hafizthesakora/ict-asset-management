import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import React from 'react';

export default async function Items() {
  const items = await getData('items');
  const columns = ['title', 'category.title', 'warehouse.title', 'createdAt'];
  return (
    <div>
      {/* HEAdER */}
      <FixedHeader title="Items" newLink="/dashboard/inventory/items/new" />
      {/* Table */}
      <div className="my-4 p-8">
        <DataTable data={items} columns={columns} resourceTitle="items" />
      </div>
    </div>
  );
}
