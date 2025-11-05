'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Settings, Plus } from 'lucide-react';
import DataTable from '@/components/dashboard/DataTable';

export default function ICTServicesClient({ initialPeople, columns }) {
  const [people, setPeople] = useState(initialPeople || []);
  const router = useRouter();

  // Ensure people is an array and enhance data with access counts and actions
  const safePeople = Array.isArray(people) ? people : [];
  const enhancedPeople = safePeople.map((person) => ({
    ...person,
    activeAccesses: (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
        {person.employeeAccesses?.length || 0} Access{person.employeeAccesses?.length !== 1 ? 'es' : ''}
      </span>
    ),
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/dashboard/ict-services/assign/${person.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors"
        >
          <Shield size={16} />
          Assign Access
        </button>
        <button
          onClick={() => router.push(`/dashboard/ict-services/manage/${person.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
        >
          <Settings size={16} />
          Manage
        </button>
      </div>
    ),
  }));

  const enhancedColumns = [...columns, 'actions'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-6 bg-white border-b">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="text-cyan-600" size={32} />
            ICT Services
          </h1>
          <p className="text-gray-600 mt-2">
            Manage employee system accesses and permissions
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/ict-services/access-categories')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
        >
          <Settings size={20} />
          Manage Access Categories
        </button>
      </div>

      <div className="my-4 p-8">
        <DataTable
          data={enhancedPeople}
          columns={enhancedColumns}
          resourceTitle="employees"
        />
      </div>
    </div>
  );
}
