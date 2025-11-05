import React from 'react';
import db from '@/lib/db';
import ICTServicesClient from '@/components/dashboard/ICTServicesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ICTServicesPage() {
  // Fetch all people with their employee accesses
  const people = await db.people.findMany({
    orderBy: {
      title: 'asc',
    },
    include: {
      employeeAccesses: {
        where: {
          status: 'active',
        },
        include: {
          accessItem: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  const columns = ['title', 'email', 'department', 'aow', 'activeAccesses'];

  return <ICTServicesClient initialPeople={people} columns={columns} />;
}
