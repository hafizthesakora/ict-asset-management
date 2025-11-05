'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Filter,
  Calendar,
  User,
  Activity,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditTrailClient() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    performedBy: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  });
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: pagination.pageSize.toString(),
        skip: ((pagination.page - 1) * pagination.pageSize).toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/audit-logs?${queryParams}`
      );
      const data = await response.json();

      setLogs(data.logs || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/audit-logs?stats=true`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      entityType: '',
      action: '',
      performedBy: '',
      startDate: '',
      endDate: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleExpandLog = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      ASSIGN_ITEM: 'bg-purple-100 text-purple-800',
      GRANT_ACCESS: 'bg-cyan-100 text-cyan-800',
      REVOKE_ACCESS: 'bg-orange-100 text-orange-800',
      DEMOBILIZE: 'bg-red-100 text-red-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action) => {
    const icons = {
      GRANT_ACCESS: '🔓',
      REVOKE_ACCESS: '🔒',
      DEMOBILIZE: '👋',
      ASSIGN_ITEM: '📦',
      CREATE: '➕',
      UPDATE: '✏️',
      DELETE: '🗑️',
    };
    return icons[action] || '📝';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
              <p className="text-gray-600 mt-1">
                Complete activity log of system operations
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Activity className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Logs
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.totalLogs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <Calendar className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Actions Today
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.actionsToday}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <User className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {new Set(logs.slice(0, 100).map((l) => l.performedBy)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Entity Type
              </label>
              <select
                value={filters.entityType}
                onChange={(e) =>
                  handleFilterChange('entityType', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Item">Item</option>
                <option value="People">People</option>
                <option value="EmployeeAccess">Employee Access</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="ASSIGN_ITEM">Assign Item</option>
                <option value="GRANT_ACCESS">Grant Access</option>
                <option value="REVOKE_ACCESS">Revoke Access</option>
                <option value="DEMOBILIZE">Demobilize</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Performed By
              </label>
              <input
                type="text"
                value={filters.performedBy}
                onChange={(e) =>
                  handleFilterChange('performedBy', e.target.value)
                }
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange('startDate', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Activity Log
            </h2>
            <p className="text-sm text-gray-600">
              Showing {logs.length} of {pagination.total} logs
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">No audit logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getActionIcon(log.action)}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {log.entityType}
                      </span>
                      {log.entityName && (
                        <span className="text-sm font-medium text-gray-900">
                          {log.entityName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{log.performedBy}</span>
                        {log.performedByEmail && (
                          <span className="text-xs">({log.performedByEmail})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2">
                        <button
                          onClick={() => toggleExpandLog(log.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {expandedLog === log.id ? (
                            <>
                              <ChevronUp size={16} />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              View Details
                            </>
                          )}
                        </button>

                        {expandedLog === log.id && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
