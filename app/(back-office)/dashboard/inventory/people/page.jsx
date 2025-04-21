import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import React from 'react';

export default async function People() {
  const people = await getData('people');
  const columns = ['title', 'topology', 'aow', 'department'];
  return (
    <div>
      {/* HEAdER */}
      <FixedHeader title="People" newLink="/dashboard/inventory/people/new" />
      {/* Table */}
      <div className="my-4 p-8">
        <DataTable data={people} columns={columns} resourceTitle="people" />
      </div>
    </div>
  );
}
