'use client';
import Activity from '@/components/dashboard/Activity';
import AnalyticsDashboard from '@/components/dashboard/Analytics';
import DashboardBanner from '@/components/dashboard/DashboardBanner';
import ContractExpirationAlerts from '@/components/dashboard/ContractExpirationAlerts';
import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <DashboardBanner />
      <ContractExpirationAlerts />
      <Activity />
      <AnalyticsDashboard />
    </div>
  );
}
