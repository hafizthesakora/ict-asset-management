import React from 'react';

import { getData } from '@/lib/getData';
import NewPeople from '../../new/page';
import NewCallOff from '../../new/page';

export default async function Update({ params: { id } }) {
  const data = await getData(`purchases/${id}`);
  return <NewCallOff initialData={data} isUpdate={true} />;
}
