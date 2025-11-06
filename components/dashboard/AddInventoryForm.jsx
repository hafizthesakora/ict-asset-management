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

export default function AddInventoryForm({ items, warehouses, people }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [returnForms, setReturnForms] = useState([
    { id: 1, categoryId: '', itemId: '' },
  ]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('');

  // Ensure all props are arrays
  const safeItems = Array.isArray(items) ? items : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safePeople = Array.isArray(people) ? people : [];

  // Filter items based on selected person
  const assignedItems = safeItems.filter((item) => {
    // Item must be assigned to a person
    if (item.currentLocationType !== 'person' || !item.assignedToPersonId) {
      return false;
    }

    // If a person is selected, only show items assigned to that person
    if (selectedPersonId) {
      return item.assignedToPersonId === selectedPersonId;
    }

    // If no person selected, show all assigned items
    return true;
  });

  // Get unique categories from items assigned to the selected person
  const getAvailableCategories = () => {
    if (!selectedPersonId) {
      // If no person selected, show all categories that have assigned items
      const categoryIds = new Set(assignedItems.map(item => item.categoryId));
      return categories.filter(cat => categoryIds.has(cat.id));
    }

    // If person is selected, only show categories of items assigned to that person
    const personItems = safeItems.filter(
      item => item.assignedToPersonId === selectedPersonId &&
              item.currentLocationType === 'person'
    );
    const categoryIds = new Set(personItems.map(item => item.categoryId));
    return categories.filter(cat => categoryIds.has(cat.id));
  };

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

  // Reset item selections when person changes
  useEffect(() => {
    setReturnForms([{ id: 1, categoryId: '', itemId: '' }]);
  }, [selectedPersonId]);

  // Add new return form
  const addReturnForm = () => {
    setReturnForms([
      ...returnForms,
      { id: Date.now(), categoryId: '', itemId: '' },
    ]);
  };

  // Remove return form
  const removeReturnForm = (id) => {
    if (returnForms.length > 1) {
      setReturnForms(returnForms.filter((form) => form.id !== id));
    }
  };

  // Update return form
  const updateReturnForm = (id, field, value) => {
    setReturnForms(
      returnForms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  // Get filtered items for a specific category
  const getFilteredItems = (categoryId) => {
    if (!categoryId) return assignedItems;
    return assignedItems.filter((item) => item.categoryId === categoryId);
  };

  async function onSubmit(data) {
    console.log('Form data being submitted:', data);

    // Validate that at least one item is selected
    const hasSelectedItems = returnForms.some((form) => form.itemId);
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
      // Submit each item return with quantity 1
      const promises = returnForms
        .filter((form) => form.itemId)
        .map((form) =>
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/adjustments/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              addStockQty: 1,
              itemId: form.itemId,
              peopleId: selectedPersonId,
              receivingWarehouseId: selectedWarehouseId,
              notes: data.notes,
              referenceNumber: '',
            }),
          })
        );

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        toast.success(`${successCount} item(s) returned successfully`);
        setReturnForms([{ id: 1, categoryId: '', itemId: '' }]);
        reset();
        // Reload the page to refresh data
        window.location.reload();
      } else {
        toast.error('Failed to return items');
      }
    } catch (error) {
      console.error('Error returning items:', error);
      toast.error('Failed to return items');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      {assignedItems.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            No items available for return. All items are currently in warehouses.
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Total items in database: {safeItems.length}
          </p>
        </div>
      )}
      {assignedItems.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Showing {assignedItems.length} of {safeItems.length} items (only items assigned to employees)
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <SearchableSelectInput
          label="Select the person returning the Asset"
          name="peopleId"
          value={selectedPersonId}
          onChange={setSelectedPersonId}
          options={safePeople}
          displayKey="title"
          placeholder="Search people..."
        />

        <SearchableSelectInput
          label="Select the warehouse to receive the Asset"
          name="receivingWarehouseId"
          value={selectedWarehouseId}
          onChange={setSelectedWarehouseId}
          options={safeWarehouses}
          displayKey="title"
          placeholder="Search warehouses..."
        />
      </div>

      {/* Return Forms */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Items to Return (Qty: 1 each)
          </h3>
          <button
            type="button"
            onClick={addReturnForm}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {!selectedPersonId && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Please select a person first to see items assigned to them.
              </p>
            </div>
          )}
          {selectedPersonId && assignedItems.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                This person has no items assigned to them.
              </p>
            </div>
          )}
          {returnForms.map((form, index) => {
            const filteredItems = getFilteredItems(form.categoryId);
            const availableCategories = getAvailableCategories();
            return (
              <div
                key={form.id}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                {returnForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReturnForm(form.id)}
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
                      updateReturnForm(form.id, 'categoryId', value)
                    }
                    options={availableCategories}
                    displayKey="title"
                    placeholder={
                      selectedPersonId
                        ? 'All categories for this person...'
                        : 'Select person first...'
                    }
                  />

                  <SearchableSelectInput
                    label="Select Item Serial Number"
                    name={`item-${form.id}`}
                    value={form.itemId}
                    onChange={(value) =>
                      updateReturnForm(form.id, 'itemId', value)
                    }
                    options={filteredItems}
                    displayKey="serialNumber"
                    placeholder={
                      selectedPersonId
                        ? 'Search by serial number...'
                        : 'Select person first...'
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <TextAreaInput
          label="Return Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>

      <SubmitButton isLoading={loading} title="Return Items" />
    </form>
  );
}
