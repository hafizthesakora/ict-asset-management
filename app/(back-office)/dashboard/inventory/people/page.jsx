import DataTable from '@/components/dashboard/DataTable';
import FixedHeader from '@/components/dashboard/FixedHeader';
import FormHeader from '@/components/dashboard/FormHeader';
import { getData } from '@/lib/getData';
import PeopleClient from './PeopleClient';
import React from 'react';

// Ensure this page always fetches fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function People() {
  const people = await getData('people');
  // Ensure people is always an array
  const safePeople = Array.isArray(people) ? people : [];
  const columns = ['title', 'topology', 'aow', 'department', 'stockQty'];
  return <PeopleClient initialItems={safePeople} columns={columns} />;
}
