import React from 'react';
import db from '@/lib/db';
import AccessCategoriesClient from '@/components/dashboard/AccessCategoriesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AccessCategoriesPage() {
  const categories = await db.accessCategory.findMany({
    orderBy: {
      title: 'asc',
    },
    include: {
      accessItems: true,
    },
  });

  return <AccessCategoriesClient initialCategories={categories} />;
}
