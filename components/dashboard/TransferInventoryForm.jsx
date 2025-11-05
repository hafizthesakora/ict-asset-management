'use client';
import FormHeader from '@/components/dashboard/FormHeader';
import SelectInput from '@/components/FormInputs/SelectInput';
import SearchableSelectInput from '@/components/FormInputs/SearchableSelectInput';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextAreaInput from '@/components/FormInputs/TextAreaInput';
import TextInput from '@/components/FormInputs/TextInput';
import { makePostRequest } from '@/lib/apiRequest';
import { Plus, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
  const [categories, setCategories] = useState([]);
  const [assignmentForms, setAssignmentForms] = useState([
    { id: 1, categoryId: '', itemId: '' },
  ]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('');

  // Ensure all props are arrays
  const safeItems = Array.isArray(items) ? items : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safePeople = Array.isArray(people) ? people : [];

  // Filter items to show only those currently in warehouses (not assigned)
  const availableItems = safeItems.filter(
    (item) => item.currentLocationType === 'warehouse' || !item.currentLocationType
  );

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Add new assignment form
  const addAssignmentForm = () => {
    setAssignmentForms([
      ...assignmentForms,
      { id: Date.now(), categoryId: '', itemId: '' },
    ]);
  };

  // Remove assignment form
  const removeAssignmentForm = (id) => {
    if (assignmentForms.length > 1) {
      setAssignmentForms(assignmentForms.filter((form) => form.id !== id));
    }
  };

  // Update assignment form
  const updateAssignmentForm = (id, field, value) => {
    setAssignmentForms(
      assignmentForms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  // Get filtered items for a specific category
  const getFilteredItems = (categoryId) => {
    if (!categoryId) return availableItems;
    return availableItems.filter((item) => item.categoryId === categoryId);
  };

  async function onSubmit(data) {
    console.log('Form data being submitted:', data);

    // Validate that at least one item is selected
    const hasSelectedItems = assignmentForms.some((form) => form.itemId);
    if (!hasSelectedItems) {
      toast.error('Please select at least one item');
      return;
    }

    if (!selectedPersonId) {
      toast.error('Please select a person');
      return;
    }
    if (!selectedWarehouseId) {
      toast.error('Please select a warehouse');
      return;
    }

    setLoading(true);

    try {
      // Submit each item assignment with quantity 1
      const promises = assignmentForms
        .filter((form) => form.itemId)
        .map((form) =>
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/adjustments/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transferStockQty: 1,
              itemId: form.itemId,
              peopleId: selectedPersonId,
              givingWarehouseId: selectedWarehouseId,
              notes: data.notes,
            }),
          })
        );

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        toast.success(`${successCount} item(s) assigned successfully`);
        setAssignmentForms([{ id: 1, categoryId: '', itemId: '' }]);
        reset();
        // Reload the page to refresh data
        window.location.reload();
      } else {
        toast.error('Failed to assign items');
      }
    } catch (error) {
      console.error('Error assigning items:', error);
      toast.error('Failed to assign items');
    } finally {
      setLoading(false);
    }
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
        <SearchableSelectInput
          label="Select the Warehouse the product is coming from"
          name="givingWarehouseId"
          value={selectedWarehouseId}
          onChange={setSelectedWarehouseId}
          options={safeWarehouses}
          displayKey="title"
          placeholder="Search warehouses..."
        />

        <SearchableSelectInput
          label="Select the person to be allocated"
          name="peopleId"
          value={selectedPersonId}
          onChange={setSelectedPersonId}
          options={safePeople}
          displayKey="title"
          placeholder="Search people..."
        />
      </div>

      {/* Assignment Forms */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Items to Assign (Qty: 1 each)
          </h3>
          <button
            type="button"
            onClick={addAssignmentForm}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {assignmentForms.map((form, index) => {
            const filteredItems = getFilteredItems(form.categoryId);
            return (
              <div
                key={form.id}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                {assignmentForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAssignmentForm(form.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <SearchableSelectInput
                    label="Select Category (Optional Filter)"
                    name={`category-${form.id}`}
                    value={form.categoryId}
                    onChange={(value) =>
                      updateAssignmentForm(form.id, 'categoryId', value)
                    }
                    options={categories}
                    displayKey="title"
                    placeholder="All categories..."
                  />

                  <SearchableSelectInput
                    label="Select Item Serial Number"
                    name={`item-${form.id}`}
                    value={form.itemId}
                    onChange={(value) =>
                      updateAssignmentForm(form.id, 'itemId', value)
                    }
                    options={filteredItems}
                    displayKey="serialNumber"
                    placeholder="Search by serial number..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <TextAreaInput
          label="Transfer Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>

      <SubmitButton isLoading={loading} title="Assign Items" />
    </form>
  );
}
