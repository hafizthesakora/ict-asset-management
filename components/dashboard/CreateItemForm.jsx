'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormHeader from '@/components/dashboard/FormHeader';
import ImageInput from '@/components/FormInputs/ImageInput';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';

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
    setValue,
    reset,
  } = useForm({
    defaultValues: initialData,
  });

  // mapping JV Class → Eni Share
  const jvShareMapping = {
    Corporate: '100',
    OCTP: '55.56',
    'Block 4': '47.19',
  };

  const selectedUnitId = watch('unitId');

  // whenever the JV Class changes, set the Eni Share (or clear)
  useEffect(() => {
    const selected = units.find((u) => String(u.id) === String(selectedUnitId));
    if (selected && jvShareMapping[selected.title] != null) {
      setValue('eniShare', jvShareMapping[selected.title], {
        shouldValidate: true,
      });
    } else {
      setValue('eniShare', '');
    }
  }, [selectedUnitId, setValue, units]);

  const generateYearOptions = (startYear = 2000) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
      const year = currentYear - i;
      return { id: year.toString(), title: year.toString() };
    });
  };

  const [loading, setLoading] = useState(false);

  function redirect() {
    router.push('/dashboard/inventory/items');
  }

  async function onSubmit(data) {
    data.imageUrl = imageUrl;

    if (isUpdate) {
      setLoading(true);
      makePutRequest(
        setLoading,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/${initialData.id}`,
        data,
        'Item',
        redirect,
        reset
      );
    } else {
      setLoading(true);
      makePostRequest(
        setLoading,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/items`,
        data,
        'Item',
        reset
      );
      setImageUrl('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent sm:text-4xl">
            {isUpdate ? 'Update Item' : 'Create New Item'}
          </h1>
          <p className="mt-2 text-slate-600">
            {isUpdate
              ? 'Modify the item details below to update your inventory'
              : 'Fill in the details below to add a new item to your inventory'}
          </p>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-2xl transform -rotate-1"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-slate-900/10 p-8 md:p-10"
          >
            {/* Form Grid */}
            <div className="grid gap-8 lg:grid-cols-2 xl:gap-10">
              {/* Basic Information Section */}
              <div className="lg:col-span-2">
                <div className="mb-6 border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    Basic Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Essential item details and identification
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="group">
                    <TextInput
                      label="Item Name"
                      name="title"
                      register={register}
                      errors={errors}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                    />
                  </div>

                  <div className="group">
                    <SelectInput
                      register={register}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                      name="description"
                      label="Item Category"
                      options={[
                        { id: 'hardware', title: 'Hardware' },
                        { id: 'software', title: 'Software' },
                      ]}
                    />
                  </div>

                  <div className="group">
                    <TextInput
                      label="Serial Number"
                      name="serialNumber"
                      register={register}
                      errors={errors}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                    />
                  </div>

                  <div className="group">
                    <TextInput
                      label="Asset Tag"
                      name="assetTag"
                      register={register}
                      errors={errors}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                      isRequired={false}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Financial Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Pricing and ownership information
                  </p>
                </div>

                <div className="group">
                  <SelectInput
                    register={register}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    name="year"
                    label="Year of Purchase"
                    options={generateYearOptions()}
                  />
                </div>

                <div className="group">
                  <SelectInput
                    register={register}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    name="unitId"
                    label="JV Class"
                    options={units}
                  />
                </div>

                {/* Eni Share - Enhanced styling */}
                <div className="group">
                  <label
                    htmlFor="eniShare"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Eni Share (%)
                    <span className="ml-1 text-xs text-slate-500 font-normal">
                      (Auto-calculated)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="eniShare"
                      type="number"
                      value={watch('eniShare') || ''}
                      readOnly
                      className="block w-full bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-600 font-medium shadow-inner cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <input type="hidden" {...register('eniShare')} />
                  {errors.eniShare && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="h-1 w-1 bg-red-500 rounded-full"></span>
                      {errors.eniShare.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <TextInput
                    label="Buying Price (USD)"
                    name="buyingPrice"
                    register={register}
                    type="number"
                    errors={errors}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    isRequired={false}
                  />
                </div>
              </div>

              {/* Product Information Section */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    Product Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Brand, model, and specifications
                  </p>
                </div>

                <div className="group">
                  <SelectInput
                    register={register}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    name="brandId"
                    label="Brand"
                    options={brands}
                  />
                </div>

                <div className="group">
                  <TextInput
                    label="Model Type"
                    name="model"
                    register={register}
                    errors={errors}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    isRequired={false}
                  />
                </div>

                <div className="group">
                  <SelectInput
                    register={register}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    name="categoryId"
                    label="Item Description"
                    options={categories}
                  />
                </div>

                <div className="group">
                  <SelectInput
                    register={register}
                    className="w-full transition-all duration-200 group-hover:shadow-md"
                    name="supplierId"
                    label="Supplier"
                    options={suppliers}
                  />
                </div>
              </div>

              {/* Location & Documentation Section */}
              <div className="lg:col-span-2">
                <div className="mb-6 border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Location & Documentation
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Storage location and document references
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="group">
                    <SelectInput
                      register={register}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                      name="warehouseId"
                      label="Warehouse"
                      options={warehouses}
                    />
                  </div>

                  <div className="group">
                    <TextInput
                      label="Document Number"
                      name="documentNumber"
                      register={register}
                      errors={errors}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                      isRequired={false}
                    />
                  </div>

                  <div className="group">
                    <TextInput
                      label="Call Off Number"
                      name="callOff"
                      register={register}
                      errors={errors}
                      className="w-full transition-all duration-200 group-hover:shadow-md"
                      isRequired={false}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="lg:col-span-2">
                <div className="mb-6 border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    Additional Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Extra notes and comments
                  </p>
                </div>

                <div className="group">
                  <TextAreaInput
                    label="Item Notes"
                    name="notes"
                    register={register}
                    errors={errors}
                    className="transition-all duration-200 group-hover:shadow-md"
                  />
                </div>
              </div>

              {/* Image Upload Section - Commented out but styled */}
              {/* <div className="lg:col-span-2">
                <div className="mb-6 border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    Item Image
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">Upload an image of the item</p>
                </div>

                <ImageInput
                  label="Item Image"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="imageUploader"
                />
              </div> */}
            </div>

            {/* Submit Button Section */}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <div className="flex justify-end">
                <div className="w-full sm:w-auto">
                  <SubmitButton
                    isLoading={loading}
                    title={isUpdate ? 'Update Item' : 'Create New Item'}
                    className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
