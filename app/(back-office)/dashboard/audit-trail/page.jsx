import React from 'react';
import AuditTrailClient from '@/components/dashboard/AuditTrailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AuditTrailPage() {
  return <AuditTrailClient />;
}
