'use client';
import FormHeader from '@/components/dashboard/FormHeader';
import ImageInput from '@/components/FormInputs/ImageInput';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';
import { getData } from '@/lib/getData';

import { UploadButton, UploadDropzone } from '@uploadthing/react';
import { Pencil, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateItemForm({
  categories,
  units,
  brands,
  warehouses,
  suppliers,
  initialData = {},
  isUpdate = false,
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);

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
    router.push('/dashboard/inventory/items');
  }

  async function onSubmit(data) {
    data.imageUrl = imageUrl;
    console.log(data);

    if (isUpdate) {
      setLoading(true);
      const baseUrl = 'http://localhost:3000';
      makePutRequest(
        setLoading,
        `${baseUrl}/api/items/${initialData.id}`,
        data,
        'Item',
        redirect,
        reset
      );
    } else {
      setLoading(true);
      const baseUrl = 'http://localhost:3000';
      makePostRequest(setLoading, `${baseUrl}/api/items`, data, 'Item', reset);
      setImageUrl('');
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Item Name"
          name="title"
          register={register}
          errors={errors}
          className="w-full"
        />

        <SelectInput
          register={register}
          className="w-full"
          name="categoryId"
          label="Select the item category"
          options={categories}
        />

        <TextInput
          label="Item SKU"
          name="sku"
          register={register}
          errors={errors}
          className="w-full"
        />

        <TextInput
          label="Item Barcode"
          name="barcode"
          register={register}
          errors={errors}
          className="w-full"
        />

        <TextInput
          label="Quantity"
          name="qty"
          register={register}
          errors={errors}
          className="w-full"
        />

        <SelectInput
          register={register}
          className="w-full"
          name="unitId"
          label="Select the item unit"
          options={units}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="brandId"
          label="Select the item brand"
          options={brands}
        />

        <TextInput
          label="Serial Number"
          name="buyingPrice"
          register={register}
          type="number"
          errors={errors}
          className="w-full"
          isRequired={false}
        />

        <TextInput
          label="Model Number"
          name="sellingPrice"
          register={register}
          errors={errors}
          type="number"
          className="w-full"
          isRequired={false}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="supplierId"
          label="Select the item Supplier"
          options={suppliers}
        />

        <TextInput
          label="Re-Order Point"
          name="reOrderPoint"
          register={register}
          type="number"
          errors={errors}
          className="w-full"
          isRequired={false}
        />

        <SelectInput
          register={register}
          className="w-full"
          name="warehouseId"
          label="Select the item warehouse"
          options={warehouses}
        />

        <TextInput
          label="Item Weight in Kg"
          name="weight"
          register={register}
          type="number"
          errors={errors}
          className="w-full"
          isRequired={false}
        />

        <TextInput
          label="Item Dimensions in cm (20 x 30)"
          name="dimensions"
          register={register}
          errors={errors}
          className="w-full"
          isRequired={false}
        />

        <TextInput
          label="Item Tax Rate in %"
          name="taxRate"
          register={register}
          type="number"
          errors={errors}
          className="w-full"
          isRequired={false}
        />

        <TextAreaInput
          label="Item Description"
          name="description"
          register={register}
          errors={errors}
        />

        <TextAreaInput
          label="Item Notes"
          name="notes"
          register={register}
          errors={errors}
        />
        {/* Upload thing */}
        <ImageInput
          label="Item Image"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="imageUploader"
        />
      </div>
      <SubmitButton
        isLoading={loading}
        title={isUpdate ? 'Update' : 'New Item'}
      />
    </form>
  );
}
