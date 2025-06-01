import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import PeopleClient from './PeopleClient';
import React from 'react';

export default async function People() {
  const people = await getData('people');
  const columns = ['title', 'topology', 'aow', 'department'];
  return <PeopleClient initialItems={people} columns={columns} />;
}
