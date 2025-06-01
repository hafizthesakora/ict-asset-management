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

'use client';
import AddInventoryForm from '@/components/dashboard/AddInventoryForm';
import Assigned from '@/components/dashboard/Assigned';
import ReturnedAsset from '@/components/dashboard/ReturnedAsset';
import TransferInventoryForm from '@/components/dashboard/TransferInventoryForm';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { Minus, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';

export default async function Adjustments() {
  const [activeForm, setActiveForm] = useState('add');
  const addAdjustmentsData = getData('tradjustments/add');
  const transferAdjustmentsData = getData('tradjustments/transfer');

  const [addAdjustments, transferAdjustments] = await Promise.all([
    addAdjustmentsData,
    transferAdjustmentsData,
  ]);

  const addColumns = ['referenceNumber', 'addStockQty', 'notes', 'createdAt'];
  const transferColumns = [
    'referenceNumber',
    'transferStockQty',
    'notes',
    'createdAt',
  ];
  const tabs = [
    {
      title: 'Returned Asset',
      icon: Plus,
      form: 'add',
    },
    {
      title: 'Assigned Asset',
      icon: Minus,
      form: 'transfer',
    },
  ];

  return (
    <div>
      {/* HEAdER */}
      <FixedHeader
        title="Warehouse Adjustments"
        newLink="/dashboard/inventory/tradjustments/new"
      />

      {/* Table */}

      <div className="border-b border-gray-200 dark:border-gray-700 w-full max-w-7xl px-4 py-2 bg-white border mx-auto my-4 shadow rounded">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 items-center justify-center">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <li className="me-2" key={i}>
                <button
                  onClick={() => setActiveForm(tab.form)}
                  className={`${
                    activeForm === tab.form
                      ? 'inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group'
                      : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'
                  }`}
                >
                  <Icon className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                  {tab.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeForm === 'add' ? (
        <ReturnedAsset
          data={addAdjustments}
          columns={addColumns}
          resourceTitle="tradjustments/add"
        />
      ) : (
        <Assigned
          data={transferAdjustments}
          columns={transferColumns}
          resourceTitle="tradjustments/transfer"
        />
      )}
    </div>
  );
}
