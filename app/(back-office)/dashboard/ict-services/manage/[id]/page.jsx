import React from 'react';
import db from '@/lib/db';
import ManageAccessesClient from '@/components/dashboard/ManageAccessesClient';

export default async function ManageAccessesPage({ params }) {
  const { id } = params;

  // Get the person
  const person = await db.people.findUnique({
    where: { id },
  });

  // Get all employee accesses (both active and revoked)
  const employeeAccesses = await db.employeeAccess.findMany({
    where: {
      peopleId: id,
    },
    orderBy: {
      grantedDate: 'desc',
    },
    include: {
      accessItem: {
        include: {
          category: true,
        },
      },
    },
  });

  return <ManageAccessesClient person={person} employeeAccesses={employeeAccesses} />;
}
