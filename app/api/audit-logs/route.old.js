import { NextResponse } from 'next/server';
import { getAuditLogs, getAuditLogStats } from '@/lib/auditLog';

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const statsOnly = searchParams.get('stats');

    // If requesting stats only
    if (statsOnly === 'true') {
      const stats = await getAuditLogStats();
      return NextResponse.json(stats);
    }

    // Get filters from query params
    const filters = {
      entityType: searchParams.get('entityType'),
      entityId: searchParams.get('entityId'),
      action: searchParams.get('action'),
      performedBy: searchParams.get('performedBy'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      limit: parseInt(searchParams.get('limit') || '100'),
      skip: parseInt(searchParams.get('skip') || '0'),
    };

    const { logs, total } = await getAuditLogs(filters);

    return NextResponse.json({
      logs,
      total,
      page: Math.floor(filters.skip / filters.limit) + 1,
      pageSize: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch audit logs',
      },
      {
        status: 500,
      }
    );
  }
}
