import React from 'react';
import { getData } from '@/lib/getData';
import NewCategory from '../../new/page';

export default async function Update({ params: { id } }) {
  const data = await getData(`categories/${id}`);
  return <NewCategory initialData={data} isUpdate={true} />;
}
