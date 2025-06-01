'use client';

import {
  X,
  Package,
  Tag,
  Truck,
  MapPin,
  Archive,
  FileText,
  DollarSign,
} from 'lucide-react';
import React from 'react';

export default function InventoryDetailPopup({ warehouse, allData, onClose }) {
  const { categories, suppliers } = allData;

  // Assume warehouse.items exists (populated via Prisma relations)
  const warehouseItems = warehouse.items || [];

  // Extract unique category IDs using the schema's field (categoryId)
  const categoryIds = [
    ...new Set(
      warehouseItems.map((item) => item.categoryId).filter((id) => id)
    ),
  ];

  // Filter the categories that match these IDs
  const warehouseCategories = categories.filter((cat) =>
    categoryIds.includes(cat.id)
  );

  // Extract unique supplier IDs (using supplierId)
  const supplierIds = [
    ...new Set(
      warehouseItems.map((item) => item.supplierId).filter((id) => id)
    ),
  ];
  const warehouseSuppliers = suppliers.filter((sup) =>
    supplierIds.includes(sup.id)
  );

  // Group items by category (using category.title for labels)
  const itemsByCategory = {};
  categoryIds.forEach((catId) => {
    const categoryItems = warehouseItems.filter(
      (item) => item.categoryId === catId
    );
    const category = categories.find((cat) => cat.id === catId);

    if (category) {
      itemsByCategory[category.title] = categoryItems;
    } else {
      // Fallback to "Uncategorized" if the category is not found
      itemsByCategory['Uncategorized'] = (
        itemsByCategory['Uncategorized'] || []
      ).concat(categoryItems);
    }
  });

  // Calculate total value
  const totalValue = warehouseItems.reduce(
    (sum, item) => sum + (item.sellingPrice || 0) * (item.quantity || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">{warehouse.title}</h2>
              <p className="text-blue-100 text-sm">
                Inventory Management System
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Items */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Package size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                  TOTAL
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {warehouseItems.length}
              </p>
              <p className="text-sm text-gray-600">Items in stock</p>
            </div>

            {/* Categories */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Tag size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-200 px-2 py-1 rounded-full">
                  UNIQUE
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {warehouseCategories.length}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>

            {/* Suppliers */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Truck size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-200 px-2 py-1 rounded-full">
                  ACTIVE
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {warehouseSuppliers.length}
              </p>
              <p className="text-sm text-gray-600">Suppliers</p>
            </div>

            {/* Total Value */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <DollarSign size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                  VALUE
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                ${totalValue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total inventory</p>
            </div>
          </div>

          {/* Warehouse Details */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Archive size={20} className="text-gray-600" />
              Warehouse Information
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-500 rounded-lg mt-1">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {warehouse.location || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-500 rounded-lg mt-1">
                    <Package size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Stock Quantity
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {warehouse.stockQty || 0} units
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-500 rounded-lg mt-1">
                    <Archive size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Type
                    </p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {warehouse.warehouseType || 'Standard'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-500 rounded-lg mt-1">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {warehouse.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Grouped by Category */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Tag size={20} className="text-gray-600" />
              Items by Category
            </h3>
            {Object.entries(itemsByCategory).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(itemsByCategory).map(
                  ([categoryTitle, items]) => (
                    <div
                      key={categoryTitle}
                      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 border-b border-indigo-200">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                            {categoryTitle}
                          </h4>
                          <span className="bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {items.length} items
                          </span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {items.slice(0, 3).map((item, index) => {
                          const supplier = suppliers.find(
                            (sup) => sup.id === item.supplierId
                          );
                          return (
                            <div
                              key={index}
                              className="p-4 hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-lg font-semibold text-gray-800 mb-1">
                                    {item.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck size={14} />
                                    {supplier
                                      ? supplier.title
                                      : 'No supplier assigned'}
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-xl font-bold text-green-600 mb-1">
                                    ${(item.sellingPrice || 0).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    Qty: {item.quantity || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {items.length > 3 && (
                          <div className="p-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                            <p className="text-blue-700 font-medium">
                              + {items.length - 3} more items in this category
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Package size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-500 mb-2">
                  No items found
                </p>
                <p className="text-gray-400">
                  This warehouse doesn't contain any items yet.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 hover:shadow-md"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
