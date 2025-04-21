import React from 'react';

import { getData } from '@/lib/getData';
import NewPeople from '../../new/page';

export default async function Update({ params: { id } }) {
  const data = await getData(`people/${id}`);
  return <NewPeople initialData={data} isUpdate={true} />;
}
