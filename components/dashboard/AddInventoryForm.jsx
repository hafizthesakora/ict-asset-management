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

  async function onSubmit(data) {
    // console.log(data);
    setLoading(true);
    const baseUrl = 'http://localhost:3000';
    makePostRequest(
      setLoading,
      `${baseUrl}/api/adjustments/add`,
      data,
      'Adjustment Add',
      reset
    );
  }

  console.log(items);
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

        {/* <TextInput
          label="Quantity to be returned"
          name="addStockQty"
          type="number"
          register={register}
          className="w-full"
          errors={errors}
        /> */}
        <SelectInput
          register={register}
          className="w-full"
          name="itemId"
          label="Select the Serial number of the Item to be returned"
          options={items}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="peopleId"
          label="Select the person to be returning Asset"
          options={people}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="receivingWarehouseId"
          label="Select the warehouse to be receiving the Asset"
          options={warehouses}
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
