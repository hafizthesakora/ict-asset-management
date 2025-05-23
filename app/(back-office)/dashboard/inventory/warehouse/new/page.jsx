'use client';
import FormHeader from '@/components/dashboard/FormHeader';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function NewWarehouse({ initialData = {}, isUpdate = false }) {
  const router = useRouter();
  const selectOptions = [
    {
      title: 'Main',
      id: 'main',
    },
    {
      title: 'Branch',
      id: 'branch',
    },
  ];

  const selectLocation = [
    {
      title: 'Accra Office',
      id: 'accra-headoffice',
    },
    {
      title: 'ORF Sanzule',
      id: 'orf-sanzule',
    },
    {
      title: 'Takoradi Office',
      id: 'takoradi-office',
    },
  ];
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
    router.push('/dashboard/inventory/warehouse');
  }

  async function onSubmit(data) {
    if (isUpdate) {
      setLoading(true);
      const baseUrl = 'http://localhost:3000';
      makePutRequest(
        setLoading,
        `${baseUrl}/api/warehouse/${initialData.id}`,
        data,
        'Warehouse',
        redirect,
        reset
      );
    } else {
      setLoading(true);
      const baseUrl = 'http://localhost:3000';
      makePostRequest(
        setLoading,
        `${baseUrl}/api/warehouse`,
        data,
        'Warehouse',
        reset
      );
    }
  }
  return (
    <div>
      {/* HEAdER */}
      <FormHeader
        title={isUpdate ? 'Update Warehouse' : 'New Warehouse'}
        href="/dashboard/inventory/warehouse"
      />
      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <SelectInput
            register={register}
            className="w-full"
            name="type"
            label="Select warehouse type"
            options={selectOptions}
          />
          <TextInput
            label="Warehouse Title"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
          />

          <SelectInput
            register={register}
            className="w-full"
            name="location"
            label="Warehouse Location"
            options={selectLocation}
          />

          <TextAreaInput
            label="Warehouse Description"
            name="description"
            register={register}
            errors={errors}
          />
        </div>
        <SubmitButton
          isLoading={loading}
          title={isUpdate ? 'Update' : 'New Warehouse'}
        />
      </form>
    </div>
  );
}
