import React from 'react';
import db from '@/lib/db';
import AssignAccessClient from '@/components/dashboard/AssignAccessClient';

export default async function AssignAccessPage({ params }) {
  const { id } = params;

  // Get the person
  const person = await db.people.findUnique({
    where: { id },
  });

  // Get all access categories with their items
  const categories = await db.accessCategory.findMany({
    orderBy: {
      title: 'asc',
    },
    include: {
      accessItems: true,
    },
  });

  // Get person's current accesses
  const currentAccesses = await db.employeeAccess.findMany({
    where: {
      peopleId: id,
      status: 'active',
    },
    include: {
      accessItem: true,
    },
  });

  return (
    <AssignAccessClient
      person={person}
      categories={categories}
      currentAccesses={currentAccesses}
    />
  );
}
