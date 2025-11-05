import DataTable from '@/components/dashboard/DataTable';
import React from 'react';

export default function Assigned({ data, columns, resourceTitle }) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div>
      {/* Table */}
      <div className="my-4 p-8">
        <DataTable
          data={safeData}
          columns={columns}
          resourceTitle={resourceTitle}
        />
      </div>
    </div>
  );
}
