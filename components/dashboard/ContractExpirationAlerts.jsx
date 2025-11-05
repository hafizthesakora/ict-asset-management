'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X, User, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ContractExpirationAlerts() {
  const [alerts, setAlerts] = useState({
    expired: [],
    expiringSoon: [],
    expiringThisWeek: [],
  });
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchExpiringContracts();
  }, []);

  const fetchExpiringContracts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/people`,
        {
          cache: 'no-store',
        }
      );
      const people = await response.json();

      const today = new Date();
      const expired = [];
      const expiringSoon = [];
      const expiringThisWeek = [];

      people.forEach((person) => {
        if (!person.contractEndDate || person.status === 'inactive') return;

        const endDate = new Date(person.contractEndDate);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          expired.push({ ...person, daysOverdue: Math.abs(diffDays) });
        } else if (diffDays <= 7) {
          expiringThisWeek.push({ ...person, daysLeft: diffDays });
        } else if (diffDays <= 30) {
          expiringSoon.push({ ...person, daysLeft: diffDays });
        }
      });

      setAlerts({ expired, expiringSoon, expiringThisWeek });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contract expirations:', error);
      setLoading(false);
    }
  };

  const dismissAlert = (personId) => {
    setDismissed((prev) => new Set([...prev, personId]));
  };

  const handleViewProfile = (personId) => {
    router.push(`/dashboard/inventory/people/${personId}`);
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
      </div>
    );
  }

  const totalAlerts =
    alerts.expired.length +
    alerts.expiringThisWeek.length +
    alerts.expiringSoon.length;

  if (totalAlerts === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Contract Alerts</h2>
        <button
          onClick={fetchExpiringContracts}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Expired Contracts - Critical */}
      {alerts.expired.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-red-600 mt-0.5" size={24} />
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-red-900">
                Expired Contracts ({alerts.expired.length})
              </h3>
              <p className="text-sm text-red-700 mb-3">
                The following employees have expired contracts and need immediate
                offboarding
              </p>
              <div className="space-y-2">
                {alerts.expired
                  .filter((person) => !dismissed.has(person.id))
                  .map((person) => (
                    <div
                      key={person.id}
                      className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {person.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {person.department || 'No department'} •{' '}
                            <span className="text-red-600 font-medium">
                              Expired {person.daysOverdue} days ago
                            </span>
                          </p>
                          {person.assignedItems?.length > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                              {person.assignedItems.length} item(s) to collect
                            </p>
                          )}
                          {person.accesses?.filter((a) => a.status === 'active')
                            .length > 0 && (
                            <p className="text-xs text-gray-600">
                              {
                                person.accesses.filter((a) => a.status === 'active')
                                  .length
                              }{' '}
                              access(es) to revoke
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProfile(person.id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Start Offboarding
                        </button>
                        <button
                          onClick={() => dismissAlert(person.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expiring This Week - High Priority */}
      {alerts.expiringThisWeek.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-orange-600 mt-0.5" size={24} />
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-orange-900">
                Expiring This Week ({alerts.expiringThisWeek.length})
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                These contracts are expiring within 7 days
              </p>
              <div className="space-y-2">
                {alerts.expiringThisWeek
                  .filter((person) => !dismissed.has(person.id))
                  .map((person) => (
                    <div
                      key={person.id}
                      className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {person.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {person.department || 'No department'} •{' '}
                            <span className="text-orange-600 font-medium">
                              {person.daysLeft} day(s) remaining
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProfile(person.id)}
                          className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Prepare Offboarding
                        </button>
                        <button
                          onClick={() => dismissAlert(person.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expiring This Month - Medium Priority */}
      {alerts.expiringSoon.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-4">
          <div className="flex items-start">
            <Clock className="text-yellow-600 mt-0.5" size={24} />
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-yellow-900">
                Expiring This Month ({alerts.expiringSoon.length})
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                These contracts are expiring within 30 days
              </p>
              <div className="space-y-2">
                {alerts.expiringSoon
                  .filter((person) => !dismissed.has(person.id))
                  .slice(0, 5)
                  .map((person) => (
                    <div
                      key={person.id}
                      className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {person.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {person.department || 'No department'} •{' '}
                            <span className="text-yellow-600 font-medium">
                              {person.daysLeft} days remaining
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProfile(person.id)}
                          className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => dismissAlert(person.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {alerts.expiringSoon.filter((p) => !dismissed.has(p.id)).length >
                5 && (
                <p className="text-sm text-yellow-700 mt-2">
                  + {alerts.expiringSoon.length - 5} more expiring this month
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
