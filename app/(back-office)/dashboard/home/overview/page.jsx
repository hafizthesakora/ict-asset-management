'use client';
import Activity from '@/components/dashboard/Activity';
import AnalyticsDashboard from '@/components/dashboard/Analytics';
import DashboardBanner from '@/components/dashboard/DashboardBanner';
import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <DashboardBanner />
      <Activity />
      <AnalyticsDashboard />
    </div>
  );
}
