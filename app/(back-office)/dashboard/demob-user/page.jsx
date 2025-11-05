import React from 'react';
import DemobUserClient from '@/components/dashboard/DemobUserClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DemobUserPage() {
  return <DemobUserClient />;
}
