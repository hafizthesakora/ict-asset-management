'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { getActionTextColor, getActionIcon } from '@/lib/constants/auditConstants';

export default function RecentAuditActivity() {
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentLogs();
  }, []);

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/audit-logs?limit=5`
      );
      const data = await response.json();
      setRecentLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching recent audit logs:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-600">
                Latest system audit events
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/audit-trail"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : recentLogs.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="mx-auto text-gray-400" size={48} />
            <p className="mt-2 text-gray-600">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{getActionIcon(log.action)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-semibold text-sm ${getActionTextColor(
                        log.action
                      )}`}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.entityType}
                    </span>
                  </div>
                  {log.entityName && (
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {log.entityName}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>{log.performedBy}</span>
                    <span>•</span>
                    <span>
                      {new Date(log.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
