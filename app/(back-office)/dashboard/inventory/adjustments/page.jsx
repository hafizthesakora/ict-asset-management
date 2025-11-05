// import DataTable from '@/components/dashboard/DataTable';
// import FixedHeader from '@/components/dashboard/FixedHeader';
// import FormHeader from '@/components/dashboard/FormHeader';
// import { getData } from '@/lib/getData';
// import React from 'react';

// export default async function Adjustments() {
//   const addAdjustmentsData = getData('adjustments/add');
//   const transferAdjustmentsData = getData('adjustments/transfer');

//   const [addAdjustments, transferAdjustments] = await Promise.all([
//     addAdjustmentsData,
//     transferAdjustmentsData,
//   ]);

//   const addColumns = ['referenceNumber', 'addStockQty', 'notes', 'createdAt'];
//   const transferColumns = [
//     'referenceNumber',
//     'transferStockQty',
//     'notes',
//     'createdAt',
//   ];
//   return (
//     <div>
//       {/* HEAdER */}
//       <FixedHeader
//         title="Assets Manager"
//         newLink="/dashboard/inventory/adjustments/new"
//       />
//       {/* Table */}
//       <div className="my-4 p-8">
//         <h2 className="py-4 text-xl font-semibold">Returned Asset</h2>
//         <DataTable
//           data={addAdjustments}
//           columns={addColumns}
//           resourceTitle="adjustments/add"
//         />
//       </div>

//       <div className="my-4 p-8">
//         <h2 className="py-4 text-xl font-semibold">Assigned Asset</h2>
//         <DataTable
//           data={transferAdjustments}
//           columns={transferColumns}
//           resourceTitle="adjustments/transfer"
//         />
//       </div>
//     </div>
//   );
// }

import AdjustmentsClient from '@/components/dashboard/AdjustmentsClient';
import { getData } from '@/lib/getData';
import React from 'react';

// Ensure this page always fetches fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Adjustments() {
  const addAdjustmentsData = getData('adjustments/add');
  const transferAdjustmentsData = getData('adjustments/transfer');

  const [addAdjustments, transferAdjustments] = await Promise.all([
    addAdjustmentsData,
    transferAdjustmentsData,
  ]);

  const addColumns = [
    'item.serialNumber',
    'item.title',
    'people.title',
    'addStockQty',
    'notes',
    'createdAt',
  ];
  const transferColumns = [
    'item.serialNumber',
    'item.title',
    'people.title',
    'transferStockQty',
    'status',
    'notes',
    'createdAt',
  ];

  return (
    <AdjustmentsClient
      addAdjustments={addAdjustments}
      transferAdjustments={transferAdjustments}
      addColumns={addColumns}
      transferColumns={transferColumns}
    />
  );
}
