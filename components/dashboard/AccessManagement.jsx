'use client';

import React, { useState } from 'react';
import { Plus, Shield, X, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AccessManagement({
  personId,
  accesses: initialAccesses,
}) {
  const [accesses, setAccesses] = useState(initialAccesses || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    accessType: '',
    systemName: '',
    accessLevel: '',
    description: '',
  });

  const accessTypes = [
    'Email',
    'VPN',
    'Shared Mailbox',
    'Application',
    'Physical Access',
    'Bacups',
    'Intranet',
    'Shared Drive',
    'Other',
  ];

  const accessLevels = ['Read Only', 'Read/Write', 'Admin', 'Super Admin'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/accesses`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            peopleId,
          }),
        }
      );

      if (response.ok) {
        const newAccess = await response.json();
        setAccesses([newAccess, ...accesses]);
        toast.success('Access added successfully');
        setShowAddForm(false);
        setFormData({
          accessType: '',
          systemName: '',
          accessLevel: '',
          description: '',
        });
        router.refresh();
      } else {
        toast.error('Failed to add access');
      }
    } catch (error) {
      console.error('Error adding access:', error);
      toast.error('Failed to add access');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (accessId) => {
    if (!confirm('Are you sure you want to revoke this access?')) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/accesses?id=${accessId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setAccesses(accesses.filter((a) => a.id !== accessId));
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

  const activeAccesses = accesses.filter((a) => a.status === 'active');
  const revokedAccesses = accesses.filter((a) => a.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">System Accesses</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Cancel' : 'Add Access'}
        </button>
      </div>

      {/* Add Access Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <h4 className="font-semibold text-gray-900">Add New Access</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Type *
              </label>
              <select
                value={formData.accessType}
                onChange={(e) =>
                  setFormData({ ...formData, accessType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                {accessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Name *
              </label>
              <input
                type="text"
                value={formData.systemName}
                onChange={(e) =>
                  setFormData({ ...formData, systemName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Office 365, AWS Console"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <select
                value={formData.accessLevel}
                onChange={(e) =>
                  setFormData({ ...formData, accessLevel: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                {accessLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional notes"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Access'}
            </button>
          </div>
        </form>
      )}

      {/* Active Accesses */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          Active Accesses ({activeAccesses.length})
        </h4>

        {activeAccesses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Shield size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No active accesses</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAccesses.map((access) => (
              <div
                key={access.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-blue-600" />
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {access.systemName}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {access.accessType}
                          {access.accessLevel && ` • ${access.accessLevel}`}
                        </p>
                        {access.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {access.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Granted:{' '}
                          {new Date(access.grantedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeAccess(access.id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoked Accesses */}
      {revokedAccesses.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle size={20} className="text-gray-600" />
            Revoked Accesses ({revokedAccesses.length})
          </h4>
          <div className="space-y-3">
            {revokedAccesses.map((access) => (
              <div
                key={access.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
              >
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-400" />
                  <div>
                    <h5 className="font-semibold text-gray-700">
                      {access.systemName}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {access.accessType}
                      {access.accessLevel && ` • ${access.accessLevel}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Revoked</p>
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
