import { NextResponse } from 'next/server';
import {
  getAuditLogs,
  getAuditLogStats,
  searchAuditLogs,
} from '@/lib/auditLog';
import { AUDIT_FILTERS } from '@/lib/constants/auditConstants';

/**
 * Parse and validate query parameters
 */
function parseQueryParams(searchParams) {
  const limit = parseInt(searchParams.get('limit') || AUDIT_FILTERS.DEFAULT_LIMIT);
  const skip = parseInt(searchParams.get('skip') || AUDIT_FILTERS.DEFAULT_SKIP);

  return {
    entityType: searchParams.get('entityType') || undefined,
    entityId: searchParams.get('entityId') || undefined,
    action: searchParams.get('action') || undefined,
    performedBy: searchParams.get('performedBy') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    search: searchParams.get('search') || undefined,
    includeDetails: searchParams.get('includeDetails') !== 'false',
    limit: isNaN(limit) ? AUDIT_FILTERS.DEFAULT_LIMIT : Math.min(limit, AUDIT_FILTERS.MAX_LIMIT),
    skip: isNaN(skip) ? AUDIT_FILTERS.DEFAULT_SKIP : skip,
  };
}

/**
 * GET /api/audit-logs
 * Fetch audit logs with filtering, pagination, and search
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Check if requesting stats only
    if (searchParams.get('stats') === 'true') {
      const stats = await getAuditLogStats();

      return NextResponse.json(stats, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Parse query parameters
    const filters = parseQueryParams(searchParams);

    // Handle search query
    if (filters.search) {
      const logs = await searchAuditLogs(filters.search, filters.limit);
      return NextResponse.json({
        logs,
        total: logs.length,
        page: 1,
        pageSize: filters.limit,
        totalPages: 1,
        hasMore: false,
      });
    }

    // Get logs with filters
    const { logs, total, hasMore } = await getAuditLogs(filters);

    const response = {
      logs,
      total,
      page: Math.floor(filters.skip / filters.limit) + 1,
      pageSize: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
      hasMore,
      filters: {
        entityType: filters.entityType,
        action: filters.action,
        performedBy: filters.performedBy,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        message: 'Failed to fetch audit logs',
        logs: [],
        total: 0,
      },
      {
        status: 500,
      }
    );
  }
}
