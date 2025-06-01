import AdjustmentForm from '@/components/dashboard/AdjustmentForm';
import TransferStockForm from '@/components/dashboard/TransferStock';
import { getData } from '@/lib/getData';

import React from 'react';

export default async function NewAdjustments() {
  const itemsData = getData('items');
  const warehousesData = getData('warehouse');
  const peopleData = getData('people');

  const [items, warehouses, people] = await Promise.all([
    itemsData,
    warehousesData,
    peopleData,
  ]);

  return (
    <TransferStockForm items={items} warehouses={warehouses} people={people} />
  );
}
