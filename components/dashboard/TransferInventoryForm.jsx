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
import toast from 'react-hot-toast';

export default function TransferInventoryForm({ items, warehouses, people }) {
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

  // Filter items to show only those currently in warehouses (not assigned)
  const availableItems = safeItems.filter(
    (item) => item.currentLocationType === 'warehouse' || !item.currentLocationType
  );

  // Debug: Log item states
  console.log('Assignment Form - All items:', safeItems.length);
  console.log('Assignment Form - Available items (filtered):', availableItems.length);
  safeItems.forEach(item => {
    console.log(`Item ${item.serialNumber}: locationType=${item.currentLocationType}, assignedTo=${item.assignedToPersonId}`);
  });

  async function onSubmit(data) {
    console.log('Form data being submitted:', data);

    // Validate that required fields have values
    if (!data.itemId || data.itemId === '') {
      toast.error('Please select an item');
      return;
    }
    if (!data.peopleId || data.peopleId === '') {
      toast.error('Please select a person');
      return;
    }
    if (!data.givingWarehouseId || data.givingWarehouseId === '') {
      toast.error('Please select a warehouse');
      return;
    }
    if (!data.transferStockQty || data.transferStockQty === '') {
      toast.error('Please enter quantity');
      return;
    }

    setLoading(true);
    makePostRequest(
      setLoading,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/adjustments/transfer`,
      data,
      'Adjustment Transfer',
      reset
    );
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      {availableItems.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            No items available for assignment. All items are currently assigned to employees.
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Total items in database: {safeItems.length}
          </p>
        </div>
      )}
      {availableItems.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Showing {availableItems.length} of {safeItems.length} items (only items in warehouses)
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* <TextInput
          label="Reference Number"
          name="referenceNumber"
          register={register}
          errors={errors}
        /> */}

        <TextInput
          label="Quantity to be given"
          name="transferStockQty"
          className="w-full"
          type="number"
          register={register}
          errors={errors}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="itemId"
          label="Select the Item to be given"
          options={availableItems}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="givingWarehouseId"
          label="Select the Warehouse the product is coming from"
          options={safeWarehouses}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="peopleId"
          label="Select the person to be allocated"
          options={safePeople}
        />

        <TextAreaInput
          label="Transfer Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>
      <SubmitButton isLoading={loading} title="Assignment" />
    </form>
  );
}
