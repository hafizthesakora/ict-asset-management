'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FolderPlus, ListPlus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccessCategoriesClient({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(null); // categoryId
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [categoryData, setCategoryData] = useState({
    title: '',
    description: '',
  });

  const [itemData, setItemData] = useState({
    name: '',
    description: '',
  });

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/access-categories`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        }
      );

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, { ...newCategory, accessItems: [] }]);
        toast.success('Category added successfully');
        setCategoryData({ title: '', description: '' });
        setShowCategoryForm(false);
        router.refresh();
      } else {
        toast.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e, categoryId) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/access-items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...itemData, categoryId }),
        }
      );

      if (response.ok) {
        const newItem = await response.json();
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, accessItems: [...cat.accessItems, newItem] }
              : cat
          )
        );
        toast.success('Access item added successfully');
        setItemData({ name: '', description: '' });
        setShowItemForm(null);
        router.refresh();
      } else {
        toast.error('Failed to add access item');
      }
    } catch (error) {
      console.error('Error adding access item:', error);
      toast.error('Failed to add access item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId, categoryId) => {
    if (!confirm('Are you sure you want to delete this access item?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/access-items?id=${itemId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  accessItems: cat.accessItems.filter((item) => item.id !== itemId),
                }
              : cat
          )
        );
        toast.success('Access item deleted');
        router.refresh();
      } else {
        toast.error('Failed to delete access item');
      }
    } catch (error) {
      console.error('Error deleting access item:', error);
      toast.error('Failed to delete access item');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all access items under it.')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/access-categories?id=${categoryId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        toast.success('Category deleted');
        router.refresh();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Access Categories</h1>
            <p className="text-gray-600 mt-2">
              Organize system accesses into categories (e.g., Shared Mailbox, Directory Lists)
            </p>
          </div>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FolderPlus size={20} />
            {showCategoryForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>

        {/* Add Category Form */}
        {showCategoryForm && (
          <form onSubmit={handleAddCategory} className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Access Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryData.title}
                  onChange={(e) => setCategoryData({ ...categoryData, title: e.target.value })}
                  placeholder="e.g., Shared Mailbox"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={categoryData.description}
                  onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FolderPlus size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
            <p className="text-gray-600">Create your first access category to get started</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown size={20} className="text-gray-600" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {category.accessItems?.length || 0} access item{category.accessItems?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowItemForm(showItemForm === category.id ? null : category.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <ListPlus size={16} />
                    Add Access
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Add Item Form */}
              {showItemForm === category.id && (
                <form
                  onSubmit={(e) => handleAddItem(e, category.id)}
                  className="p-4 bg-cyan-50 border-b border-cyan-200"
                >
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Add Access to {category.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Name *
                      </label>
                      <input
                        type="text"
                        value={itemData.name}
                        onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
                        placeholder="e.g., MBX IT, MBX Drilling"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={itemData.description}
                        onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
                        placeholder="Optional description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowItemForm(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Access'}
                    </button>
                  </div>
                </form>
              )}

              {/* Access Items List */}
              {expandedCategories.has(category.id) && (
                <div className="p-4">
                  {category.accessItems?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No access items in this category yet</p>
                  ) : (
                    <div className="space-y-2">
                      {category.accessItems?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.id, category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
