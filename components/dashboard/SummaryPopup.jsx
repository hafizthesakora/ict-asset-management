'use client';

import { X } from 'lucide-react';
import React from 'react';

export default function SummaryPopup({
  title,
  data,
  items,
  categories,
  warehouses,
  suppliers,
  onClose,
}) {
  // Take first 5 items to show in summary
  const summaryData = data.slice(0, 5);

  const renderSummaryContent = () => {
    switch (title) {
      case 'Warehouses':
        return (
          <div className="divide-y">
            {summaryData.map((warehouse, index) => {
              // Find items in this warehouse
              const warehouseItems = items.filter(
                (item) => item.warehouseId === warehouse.id
              );
              // Get unique categories for these items
              const categoryIds = [
                ...new Set(warehouseItems.map((item) => item.categoryId)),
              ];
              const warehouseCategories = categories.filter((cat) =>
                categoryIds.includes(cat.id)
              );

              return (
                <div key={index} className="py-3">
                  <h3 className="font-medium">{warehouse.title}</h3>
                  <div className="mt-2">
                    <span className="text-gray-500">Location: </span>
                    <span>{warehouse.location || 'N/A'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Stock Quantity: </span>
                    <span>{warehouse.stockQty || 0}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Item Count: </span>
                    <span>{warehouseItems.length}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Categories: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {warehouseCategories.length > 0 ? (
                        warehouseCategories.map((cat) => (
                          <span
                            key={cat.id}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No categories</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'Categories':
        return (
          <div className="divide-y">
            {summaryData.map((category, index) => {
              // Find items in this category
              const categoryItems = items.filter(
                (item) => item.categoryId === category.id
              );
              // Get unique warehouses for these items
              const warehouseIds = [
                ...new Set(categoryItems.map((item) => item.warehouseId)),
              ];
              const categoryWarehouses = warehouses.filter((wh) =>
                warehouseIds.includes(wh.id)
              );

              return (
                <div key={index} className="py-3">
                  <h3 className="font-medium">{category.name}</h3>
                  <div className="mt-2">
                    <span className="text-gray-500">Description: </span>
                    <span>{category.description || 'N/A'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Item Count: </span>
                    <span>{categoryItems.length}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">
                      Available in Warehouses:{' '}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {categoryWarehouses.length > 0 ? (
                        categoryWarehouses.map((wh) => (
                          <span
                            key={wh.id}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            {wh.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No warehouses</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'Items':
        return (
          <div className="divide-y">
            {summaryData.map((item, index) => {
              // Find category and warehouse this item belongs to
              const category = categories.find(
                (cat) => cat.id === item.categoryId
              );
              const warehouse = warehouses.find(
                (wh) => wh.id === item.warehouseId
              );
              const supplier = suppliers.find(
                (sup) => sup.id === item.supplierId
              );

              return (
                <div key={index} className="py-3">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="mt-2">
                    <span className="text-gray-500">Price: </span>
                    <span>${item.price || '0.00'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Stock: </span>
                    <span>{item.stock || 0}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Category: </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {category ? category.name : 'Uncategorized'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Warehouse: </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {warehouse ? warehouse.title : 'No warehouse'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Supplier: </span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {supplier ? supplier.name : 'No supplier'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'Suppliers':
        return (
          <div className="divide-y">
            {summaryData.map((supplier, index) => {
              // Find items from this supplier
              const supplierItems = items.filter(
                (item) => item.supplierId === supplier.id
              );
              // Get unique categories for these items
              const categoryIds = [
                ...new Set(supplierItems.map((item) => item.categoryId)),
              ];
              const supplierCategories = categories.filter((cat) =>
                categoryIds.includes(cat.id)
              );

              return (
                <div key={index} className="py-3">
                  <h3 className="font-medium">{supplier.name}</h3>
                  <div className="mt-2">
                    <span className="text-gray-500">Contact: </span>
                    <span>{supplier.contact || 'N/A'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Address: </span>
                    <span>{supplier.address || 'N/A'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Items Supplied: </span>
                    <span>{supplierItems.length}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500">Categories Supplied: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {supplierCategories.length > 0 ? (
                        supplierCategories.map((cat) => (
                          <span
                            key={cat.id}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No categories</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return <div>No summary available</div>;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title} Summary</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Showing {Math.min(5, data.length)} of {data.length}{' '}
            {title.toLowerCase()}
          </p>
        </div>

        {renderSummaryContent()}

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
