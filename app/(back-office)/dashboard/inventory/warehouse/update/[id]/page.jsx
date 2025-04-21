import React from 'react';

import { getData } from '@/lib/getData';
import NewUnit from '../../new/page';
import NewWarehouse from '../../new/page';

export default async function Update({ params: { id } }) {
  const data = await getData(`warehouse/${id}`);
  return <NewWarehouse initialData={data} isUpdate={true} />;
}
