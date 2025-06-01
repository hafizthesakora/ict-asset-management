'use client';
import AddInventoryForm from '@/components/dashboard/AddInventoryForm';
import FormHeader from '@/components/dashboard/FormHeader';
import TransferInventoryForm from '@/components/dashboard/TransferInventoryForm';
import SelectInput from '@/components/FormInputs/SelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { Minus, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { makePostRequest } from '@/lib/apiRequest';
import toast from 'react-hot-toast';

export default function TransferStockForm({ items, warehouses, people }) {
  const tabs = [
    {
      title: 'Transfer Stock',
      icon: Minus,
      form: 'transfer',
    },
  ];
  const [activeForm, setActiveForm] = useState('add');
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
      `${baseUrl}/api/tradjustments/transfer`,
      data,
      'Adjustment Transfer',
      reset
    );
  }
  return (
    <div>
      {/* HEAdER */}
      <FormHeader
        title="Warehouse Inventory Transfer"
        href="/dashboard/inventory/adjustments"
      />
      {/* FORM */}

      <div className="border-b border-gray-200 dark:border-gray-700 w-full max-w-4xl px-4 py-2 bg-white border mx-auto my-4 shadow rounded">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <li className="me-2" key={i}>
                <button
                  onClick={() => setActiveForm(tab.form)}
                  className={`${
                    activeForm === tab.form
                      ? 'inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group'
                      : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'
                  }`}
                >
                  <Icon className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                  {tab.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

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
            name="receivingWarehouseId"
            label="Select the Warehouse the product is going to"
            options={warehouses}
          />

          <TextAreaInput
            label="Transfer Notes"
            name="notes"
            register={register}
            errors={errors}
          />
        </div>
        <SubmitButton isLoading={loading} title="Transfer" />
      </form>
    </div>
  );
}
