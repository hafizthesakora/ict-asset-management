import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import React from 'react';

export default async function Assigned({ data, columns, resourceTitle }) {
  return (
    <div>
      {/* Table */}

      <div className="my-4 p-8">
        <DataTable
          data={data}
          columns={columns}
          resourceTitle={resourceTitle}
        />
      </div>
    </div>
  );
}
