import React from 'react';
import { getData } from '@/lib/getData';
import ItemsClient from './ItemsClient';

export default async function ItemsPage() {
  const items = await getData('items');
  const columns = [
    'title',
    'unit.title',
    'category.title',
    'assetTag',
    'documentNumber',
    'serialNumber',
    'model',
    'buyingPrice',
    'eniShare',
    'year',
    'notes',
  ];

  return <ItemsClient initialItems={items} columns={columns} />;
}
