'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  X,
  RefreshCw,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getActionColor,
  getActionIcon,
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
} from '@/lib/constants/auditConstants';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function AuditTrailClient() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    performedBy: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const [expandedLog, setExpandedLog] = useState(null);

  // Debounce search and performedBy filters
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedPerformedBy = useDebounce(filters.performedBy, 500);

  // Fetch logs when filters or pagination changes
  useEffect(() => {
    fetchLogs();
  }, [
    pagination.page,
    filters.entityType,
    filters.action,
    filters.startDate,
    filters.endDate,
    debouncedSearch,
    debouncedPerformedBy,
  ]);

  // Fetch stats on mount and periodically
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh stats every minute
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: pagination.pageSize.toString(),
        skip: ((pagination.page - 1) * pagination.pageSize).toString(),
      });

      if (filters.entityType) queryParams.set('entityType', filters.entityType);
      if (filters.action) queryParams.set('action', filters.action);
      if (debouncedPerformedBy) queryParams.set('performedBy', debouncedPerformedBy);
      if (debouncedSearch) queryParams.set('search', debouncedSearch);
      if (filters.startDate) queryParams.set('startDate', filters.startDate);
      if (filters.endDate) queryParams.set('endDate', filters.endDate);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/audit-logs?${queryParams}`
      );
      const data = await response.json();

      setLogs(data.logs || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
        hasMore: data.hasMore || false,
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

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      entityType: '',
      action: '',
      performedBy: '',
      search: '',
      startDate: '',
      endDate: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchLogs(), fetchStats()]);
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const queryParams = new URLSearchParams({
        exportedBy: 'Admin User', // TODO: Get from session
      });

      if (filters.entityType) queryParams.set('entityType', filters.entityType);
      if (filters.action) queryParams.set('action', filters.action);
      if (filters.performedBy) queryParams.set('performedBy', filters.performedBy);
      if (filters.startDate) queryParams.set('startDate', filters.startDate);
      if (filters.endDate) queryParams.set('endDate', filters.endDate);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/audit-logs/export?${queryParams}`
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setExporting(false);
    }
  };

  const toggleExpandLog = useCallback((logId) => {
    setExpandedLog((prev) => (prev === logId ? null : logId));
  }, []);

  // Memoize filtered logs count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== '').length;
  }, [filters]);

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
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || logs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Download size={18} />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Activity className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Logs</p>
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
                  <p className="text-sm text-green-600 font-medium">Today</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.actionsToday}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-purple-600 font-medium">This Week</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.actionsThisWeek}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <User className="text-orange-600" size={24} />
                <div>
                  <p className="text-sm text-orange-600 font-medium">This Month</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {stats.actionsThisMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <X size={16} />
                Clear all
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by entity name, performer, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Entity Type
              </label>
              <select
                value={filters.entityType}
                onChange={(e) => handleFilterChange('entityType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {Object.values(AUDIT_ENTITIES).map((entity) => (
                  <option key={entity} value={entity}>
                    {entity}
                  </option>
                ))}
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
                {Object.entries(AUDIT_ACTIONS).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Performed By
              </label>
              <input
                type="text"
                value={filters.performedBy}
                onChange={(e) => handleFilterChange('performedBy', e.target.value)}
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
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
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
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
            <p className="text-sm text-gray-600">
              Showing {logs.length} of {pagination.total.toLocaleString()} logs
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
            <FileText className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">No audit logs found</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear filters to see all logs
              </button>
            )}
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
                        {log.action.replace(/_/g, ' ')}
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
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
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
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
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
              Page {pagination.page} of {pagination.totalPages.toLocaleString()}
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
