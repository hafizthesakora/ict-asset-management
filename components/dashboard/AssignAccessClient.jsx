'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Check, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignAccessClient({ person, categories, currentAccesses }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const router = useRouter();

  // Get IDs of currently assigned accesses
  const assignedAccessIds = new Set(
    currentAccesses.map((access) => access.accessItem.id)
  );

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleAccessSelection = (accessItemId) => {
    if (selectedAccesses.includes(accessItemId)) {
      setSelectedAccesses(selectedAccesses.filter((id) => id !== accessItemId));
    } else {
      setSelectedAccesses([...selectedAccesses, accessItemId]);
    }
  };

  const handleAssignAccesses = async () => {
    if (selectedAccesses.length === 0) {
      toast.error('Please select at least one access to assign');
      return;
    }

    setLoading(true);

    try {
      // Assign each selected access
      const promises = selectedAccesses.map((accessItemId) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/employee-accesses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessItemId,
            peopleId: person.id,
            grantedBy: 'System', // You can update this to track who granted it
          }),
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.ok).length;

      if (successCount > 0) {
        toast.success(`${successCount} access(es) assigned successfully`);
        setSelectedAccesses([]);
        router.push('/dashboard/ict-services');
        router.refresh();
      } else {
        toast.error('Failed to assign accesses');
      }
    } catch (error) {
      console.error('Error assigning accesses:', error);
      toast.error('Failed to assign accesses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="text-cyan-600" size={32} />
              Assign Access
            </h1>
            <p className="text-gray-600 mt-2">
              Assign system accesses to <span className="font-semibold">{person.title}</span>
            </p>
            {person.email && (
              <p className="text-sm text-gray-500 mt-1">{person.email}</p>
            )}
          </div>

          {selectedAccesses.length > 0 && (
            <button
              onClick={handleAssignAccesses}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              <Check size={20} />
              {loading
                ? 'Assigning...'
                : `Assign ${selectedAccesses.length} Access${selectedAccesses.length !== 1 ? 'es' : ''}`}
            </button>
          )}
        </div>
      </div>

      {/* Current Accesses */}
      {currentAccesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current Accesses ({currentAccesses.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {currentAccesses.map((access) => (
              <span
                key={access.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                <Check size={14} />
                {access.accessItem.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Access Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Accesses to Assign
        </h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Access Categories
            </h3>
            <p className="text-gray-600 mb-4">
              Create access categories first before assigning
            </p>
            <button
              onClick={() => router.push('/dashboard/ict-services/access-categories')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Access Categories
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown size={20} className="text-gray-600" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-600" />
                    )}
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {category.accessItems?.length || 0} item{category.accessItems?.length !== 1 ? 's' : ''}
                  </span>
                </button>

                {/* Access Items */}
                {expandedCategories.has(category.id) && (
                  <div className="p-4 space-y-2">
                    {category.accessItems?.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No access items in this category
                      </p>
                    ) : (
                      category.accessItems.map((item) => {
                        const isAssigned = assignedAccessIds.has(item.id);
                        const isSelected = selectedAccesses.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => !isAssigned && toggleAccessSelection(item.id)}
                            className={`
                              flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                              ${
                                isAssigned
                                  ? 'bg-green-50 border-green-200 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-200'
                                  : 'bg-white border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                              }
                            `}
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600">{item.description}</p>
                              )}
                            </div>
                            <div>
                              {isAssigned ? (
                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                  <Check size={16} />
                                  Already Assigned
                                </span>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="w-5 h-5 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
