import { getData } from '@/lib/getData';
import db from '@/lib/db';
import PeopleProfileClient from '@/components/dashboard/PeopleProfileClient';
import React from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PeopleProfile({ params }) {
  const { id } = params;

  // Fetch person details with all related data
  const person = await db.people.findUnique({
    where: { id },
    include: {
      assignedItems: {
        where: {
          currentLocationType: 'person',
        },
        include: {
          category: true,
          brand: true,
          unit: true,
          warehouse: true,
        },
      },
      employeeAccesses: {
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
      },
      transferStockAdjustments: {
        where: {
          status: 'active',
        },
        include: {
          item: {
            include: {
              category: true,
              brand: true,
            },
          },
        },
      },
      demobDocuments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!person) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Person not found</h1>
      </div>
    );
  }

  return <PeopleProfileClient person={person} />;
}
