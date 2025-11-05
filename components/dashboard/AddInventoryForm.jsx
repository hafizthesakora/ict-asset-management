'use client';
import FormHeader from '@/components/dashboard/FormHeader';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { makePostRequest } from '@/lib/apiRequest';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AddInventoryForm({ items, warehouses, people }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  // Ensure all props are arrays
  const safeItems = Array.isArray(items) ? items : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safePeople = Array.isArray(people) ? people : [];

  // Filter items to show only those currently assigned to people
  const assignedItems = safeItems.filter(
    (item) => item.currentLocationType === 'person' && item.assignedToPersonId
  );

  // Debug: Log item states
  console.log('Return Form - All items:', safeItems.length);
  console.log('Return Form - Assigned items (filtered):', assignedItems.length);
  safeItems.forEach(item => {
    console.log(`Item ${item.serialNumber}: locationType=${item.currentLocationType}, assignedTo=${item.assignedToPersonId}`);
  });

  async function onSubmit(data) {
    // console.log(data);
    setLoading(true);
    // const baseUrl = 'http://localhost:3000';
    makePostRequest(
      setLoading,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/adjustments/add`,
      data,
      'Adjustment Add',
      reset
    );
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      {assignedItems.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            No items available for return. All items are currently in warehouses.
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Total items in database: {safeItems.length}
          </p>
        </div>
      )}
      {assignedItems.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Showing {assignedItems.length} of {safeItems.length} items (only items assigned to employees)
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Reference Number"
          name="referenceNumber"
          register={register}
          errors={errors}
        />

        <TextInput
          label="Quantity to be returned"
          name="addStockQty"
          type="number"
          register={register}
          className="w-full"
          errors={errors}
          defaultValue={1}
        />
        <SelectInput
          register={register}
          className="w-full"
          name="itemId"
          label="Select the Serial number of the Item to be returned"
          options={assignedItems}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="peopleId"
          label="Select the person to be returning Asset"
          options={safePeople}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="receivingWarehouseId"
          label="Select the warehouse to be receiving the Asset"
          options={safeWarehouses}
        />

        <TextAreaInput
          label="Return Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>
      <SubmitButton isLoading={loading} title="Returned" />
    </form>
  );
}
