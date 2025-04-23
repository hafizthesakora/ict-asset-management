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

  async function onSubmit(data) {
    setLoading(true);
    const baseUrl = 'http://localhost:3000';
    makePostRequest(
      setLoading,
      `${baseUrl}/api/adjustments/transfer`,
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
          options={items}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="givingWarehouseId"
          label="Select the Warehouse the product is coming from"
          options={warehouses}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="peopleId"
          label="Select the person to be allocated"
          options={people}
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
