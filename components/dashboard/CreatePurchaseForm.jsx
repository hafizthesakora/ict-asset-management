'use client';
import FormHeader from '@/components/dashboard/FormHeader';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreatePurchaseForm({
  suppliers,
  statusOptions,
  initialData = {},
  isUpdate = false,
}) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: initialData,
  });

  const [loading, setLoading] = useState(false);

  function redirect() {
    router.push('/dashboard/inventory/purchases');
  }

  async function onSubmit(data) {
    console.log(data);
    if (isUpdate) {
      setLoading(true);
      const baseUrl = 'http://localhost:3000';
      makePutRequest(
        setLoading,
        `${baseUrl}/api/purchases/${initialData.id}`,
        data,
        'Purchase',
        redirect,
        reset
      );
    } else {
      setLoading(true);
      const baseUrl = 'http://localhost:3000';
      makePostRequest(
        setLoading,
        `${baseUrl}/api/purchases`,
        data,
        'Purchase',
        reset
      );
    }
  }
  return (
    <div>
      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput
            label="Reference Number"
            name="referenceNumber"
            register={register}
            errors={errors}
            className="w-full"
          />

          <TextInput
            label="Products"
            name="products"
            register={register}
            errors={errors}
            className="w-full"
          />

          <TextInput
            label="Quantity"
            type="number"
            name="quantity"
            register={register}
            errors={errors}
            className="w-full"
          />

          <SelectInput
            register={register}
            className="w-full"
            name="supplierId"
            label="Select supplier"
            options={suppliers}
          />

          <SelectInput
            register={register}
            className="w-full"
            name="status"
            label="Purchase Status"
            options={statusOptions}
          />

          <TextInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
            className="w-full"
          />
        </div>
        <SubmitButton
          isLoading={loading}
          title={isUpdate ? 'Update' : 'New Purchase'}
        />
      </form>
    </div>
  );
}
