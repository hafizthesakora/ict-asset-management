'use client';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Login from '../login/page';

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading User, please wait...</p>;
  }
  if (status === 'unauthenticated') {
    return <Login />;
  }
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className="lg:ml-64 ml-0 w-full bg-slate-100 min-h-screen flex-1 overflow-hidden">
        <Header setShowSidebar={setShowSidebar} />
        <div className="h-full overflow-auto">{children}</div>
      </main>
    </div>
  );
}
