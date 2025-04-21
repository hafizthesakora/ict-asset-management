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

export default function AdjustmentForm({ items, warehouses, people }) {
  const tabs = [
    {
      title: 'Returning Asset',
      icon: Plus,
      form: 'add',
    },
    {
      title: 'Giving Asset',
      icon: Minus,
      form: 'transfer',
    },
  ];
  const [activeForm, setActiveForm] = useState('add');
  return (
    <div>
      {/* HEAdER */}
      <FormHeader
        title="Assignment Management"
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

      {activeForm === 'add' ? (
        <AddInventoryForm
          items={items}
          warehouses={warehouses}
          people={people}
        />
      ) : (
        <TransferInventoryForm
          items={items}
          warehouses={warehouses}
          people={people}
        />
      )}
    </div>
  );
}
