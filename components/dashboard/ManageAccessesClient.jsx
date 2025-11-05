'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, XCircle, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageAccessesClient({ person, employeeAccesses: initialAccesses }) {
  const [accesses, setAccesses] = useState(initialAccesses || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const activeAccesses = accesses.filter((a) => a.status === 'active');
  const revokedAccesses = accesses.filter((a) => a.status === 'revoked');

  const handleRevokeAccess = async (accessId) => {
    if (!confirm('Are you sure you want to revoke this access?')) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/employee-accesses`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: accessId,
            status: 'revoked',
            revokedBy: 'System', // You can update this to track who revoked it
          }),
        }
      );

      if (response.ok) {
        const updatedAccess = await response.json();
        setAccesses(accesses.map((a) => (a.id === accessId ? updatedAccess : a)));
        toast.success('Access revoked successfully');
        router.refresh();
      } else {
        toast.error('Failed to revoke access');
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error('Failed to revoke access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="text-cyan-600" size={32} />
              Manage Accesses
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage accesses for <span className="font-semibold">{person.title}</span>
            </p>
            {person.email && (
              <p className="text-sm text-gray-500 mt-1">{person.email}</p>
            )}
          </div>

          <button
            onClick={() => router.push(`/dashboard/ict-services/assign/${person.id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <Shield size={20} />
            Assign More Access
          </button>
        </div>
      </div>

      {/* Active Accesses */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          Active Accesses ({activeAccesses.length})
        </h2>

        {activeAccesses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Accesses
            </h3>
            <p className="text-gray-600">This employee doesn't have any active system accesses</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAccesses.map((access) => (
              <div
                key={access.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {access.accessItem.category.title}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {access.accessItem.name}
                  </h4>
                  {access.accessItem.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {access.accessItem.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Granted: {new Date(access.grantedDate).toLocaleDateString()}
                    </span>
                    {access.grantedBy && <span>By: {access.grantedBy}</span>}
                  </div>
                  {access.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      Note: {access.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRevokeAccess(access.id)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoked Accesses */}
      {revokedAccesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle size={20} className="text-red-600" />
            Revoked Accesses ({revokedAccesses.length})
          </h2>

          <div className="space-y-3">
            {revokedAccesses.map((access) => (
              <div
                key={access.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-75"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                      {access.accessItem.category.title}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      REVOKED
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    {access.accessItem.name}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Granted: {new Date(access.grantedDate).toLocaleDateString()}
                    </span>
                    {access.revokedDate && (
                      <span className="flex items-center gap-1">
                        Revoked: {new Date(access.revokedDate).toLocaleDateString()}
                      </span>
                    )}
                    {access.revokedBy && <span>By: {access.revokedBy}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
