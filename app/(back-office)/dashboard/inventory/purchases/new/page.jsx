import CreatePurchaseForm from '@/components/dashboard/CreatePurchaseForm';
import FormHeader from '@/components/dashboard/FormHeader';

import { getData } from '@/lib/getData';

import React from 'react';

export default async function NewCallOff({
  initialData = {},
  isUpdate = false,
}) {
  const suppliers = await getData('suppliers');

  const statusOptions = [
    { id: 'PENDING', title: 'Pending' },
    { id: 'APPROVED', title: 'Approved' },
    { id: 'REJECTED', title: 'Rejected' },
    { id: 'RECEIVED', title: 'Received' },
    { id: 'CANCELLED', title: 'Cancelled' },
  ];

  return (
    <div>
      {/* HEAdER */}
      <FormHeader
        title={isUpdate ? 'Update Call Off' : 'New Call Off'}
        href="/dashboard/purchases"
      />

      <CreatePurchaseForm
        suppliers={suppliers}
        statusOptions={statusOptions}
        initialData={initialData}
        isUpdate={isUpdate}
      />
    </div>
  );
}
