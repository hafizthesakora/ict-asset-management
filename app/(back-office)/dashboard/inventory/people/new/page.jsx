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

export default function NewPeople({ initialData = {}, isUpdate = false }) {
  const router = useRouter();
  const selectOptions = [
    {
      title: 'Expat',
      id: 'expat',
    },
    {
      title: 'National',
      id: 'national',
    },
    {
      title: 'Contractor',
      id: 'contractor',
    },
    {
      title: 'Intern',
      id: 'intern',
    },
    {
      title: 'National Service',
      id: 'national_service',
    },
  ];

  const departments = [
    {
      title: 'HR & T',
      id: 'hr&t',
    },
    {
      title: 'Technical',
      id: 'technical',
    },
    {
      title: 'HSE',
      id: 'hse',
    },
    {
      title: 'Commercial and Business Development',
      id: 'cbd',
    },
    {
      title: 'Legal',
      id: 'legal',
    },
    {
      title: 'Local Content',
      id: 'local-content',
    },
    {
      title: 'Procurement',
    },
    {
      title: 'Procurement',
      id: 'procurement',
    },
    {
      title: 'Finance',
      id: 'finance',
    },
    {
      title: 'MD',
      id: 'md',
    },
    {
      title: 'Exploration',
      id: 'exploration',
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
  // Format date for input field (YYYY-MM-DD)
  const formattedInitialData = initialData?.contractEndDate
    ? {
        ...initialData,
        contractEndDate: new Date(initialData.contractEndDate)
          .toISOString()
          .split('T')[0],
      }
    : initialData;

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: formattedInitialData,
  });

  const [loading, setLoading] = useState(false);

  function redirect() {
    router.push('/dashboard/inventory/people');
  }

  async function onSubmit(data) {
    if (isUpdate) {
      setLoading(true);
      makePutRequest(
        setLoading,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/people/${initialData.id}`,
        data,
        'People',
        redirect,
        reset
      );
    } else {
      setLoading(true);
      makePostRequest(
        setLoading,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/people`,
        data,
        'People',
        reset,
        redirect
      );
    }
  }
  return (
    <div>
      {/* HEAdER */}
      <FormHeader
        title={isUpdate ? 'Update Personnel' : 'New Personnel'}
        href="/dashboard/inventory/people"
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
            name="topology"
            label="Select person topology"
            options={selectOptions}
          />
          <TextInput
            label="Person Name"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
          />

          <TextInput
            label="Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors}
            className="w-full"
          />

          <SelectInput
            register={register}
            className="w-full"
            name="department"
            label="Person Department"
            options={departments}
          />

          <SelectInput
            register={register}
            className="w-full"
            name="aow"
            label="Person Area of Work"
            options={selectLocation}
          />

          <TextInput
            label="Contract End Date"
            name="contractEndDate"
            type="date"
            register={register}
            errors={errors}
            className="w-full"
          />
        </div>
        <SubmitButton
          isLoading={loading}
          title={isUpdate ? 'Update' : 'New Personnel'}
        />
      </form>
    </div>
  );
}
