'use client';

import { X, Package, Tag, Truck } from 'lucide-react';
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {warehouse.title} Inventory Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Items */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package size={20} className="text-blue-600" />
              <h3 className="font-medium">Total Items</h3>
            </div>
            <p className="text-2xl font-bold">{warehouseItems.length}</p>
          </div>

          {/* Categories */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={20} className="text-green-600" />
              <h3 className="font-medium">Categories</h3>
            </div>
            <p className="text-2xl font-bold">{warehouseCategories.length}</p>
          </div>

          {/* Suppliers */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Truck size={20} className="text-orange-600" />
              <h3 className="font-medium">Suppliers</h3>
            </div>
            <p className="text-2xl font-bold">{warehouseSuppliers.length}</p>
          </div>
        </div>

        {/* Warehouse Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Warehouse Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium">{warehouse.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Stock Quantity</p>
                <p className="font-medium">{warehouse.stockQty || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium capitalize">
                  {warehouse.warehouseType || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Description</p>
                <p className="font-medium">{warehouse.description || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grouped by Category */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Items by Category</h3>
          {Object.entries(itemsByCategory).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(itemsByCategory).map(([categoryTitle, items]) => (
                <div
                  key={categoryTitle}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-blue-50 p-3 border-b">
                    <h4 className="font-medium">
                      {categoryTitle} ({items.length})
                    </h4>
                  </div>
                  <div className="divide-y">
                    {items.slice(0, 3).map((item, index) => {
                      const supplier = suppliers.find(
                        (sup) => sup.id === item.supplierId
                      );
                      return (
                        <div
                          key={index}
                          className="p-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">
                              {supplier
                                ? `Supplier: ${supplier.title}`
                                : 'No supplier'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${item.sellingPrice || '0.00'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity || 0}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {items.length > 3 && (
                      <div className="p-3 text-center text-blue-600 bg-blue-50">
                        + {items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No items in this warehouse
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
