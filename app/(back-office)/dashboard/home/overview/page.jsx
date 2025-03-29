import Activity from '@/components/dashboard/Activity';
import DashboardBanner from '@/components/dashboard/DashboardBanner';
import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <DashboardBanner />
      <Activity />
    </div>
  );
}
