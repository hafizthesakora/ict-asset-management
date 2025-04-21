import CreateItemForm from '@/components/dashboard/CreateItemForm';
import FormHeader from '@/components/dashboard/FormHeader';

import { getData } from '@/lib/getData';

import React from 'react';

export default async function NewItem({ initialData = {}, isUpdate = false }) {
  const categoriesData = getData('categories');
  const unitsData = getData('units');
  const brandsData = getData('brands');
  const warehousesData = getData('warehouse');
  const suppliersData = getData('suppliers');

  //Note: This is called Parallel fetching, it uses the Promise.all approach hence all the data is fetched at once.
  const [categories, units, brands, warehouses, suppliers] = await Promise.all([
    categoriesData,
    unitsData,
    brandsData,
    warehousesData,
    suppliersData,
  ]);

  return (
    <div>
      {/* HEAdER */}
      <FormHeader
        title={isUpdate ? 'Update Item' : 'New Item'}
        href="/dashboard/inventory/items"
      />
      {/* FORM */}
      <CreateItemForm
        categories={categories}
        units={units}
        brands={brands}
        warehouses={warehouses}
        suppliers={suppliers}
        initialData={initialData}
        isUpdate={isUpdate}
      />
    </div>
  );
}
