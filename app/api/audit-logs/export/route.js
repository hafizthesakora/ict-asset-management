import { NextResponse } from 'next/server';
import { getAuditLogs, createAuditLog } from '@/lib/auditLog';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/constants/auditConstants';

/**
 * Convert audit logs to CSV format
 */
function convertToCSV(logs) {
  if (logs.length === 0) {
    return 'No data available';
  }

  // CSV headers
  const headers = [
    'Timestamp',
    'Action',
    'Entity Type',
    'Entity Name',
    'Performed By',
    'Email',
    'IP Address',
    'Details',
  ];

  // Convert logs to CSV rows
  const rows = logs.map((log) => [
    new Date(log.createdAt).toLocaleString(),
    log.action,
    log.entityType,
    log.entityName || 'N/A',
    log.performedBy,
    log.performedByEmail || 'N/A',
    log.ipAddress || 'N/A',
    log.details ? JSON.stringify(log.details) : 'N/A',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * GET /api/audit-logs/export
 * Export audit logs as CSV
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Get filters from query params
    const filters = {
      entityType: searchParams.get('entityType') || undefined,
      entityId: searchParams.get('entityId') || undefined,
      action: searchParams.get('action') || undefined,
      performedBy: searchParams.get('performedBy') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: 10000, // Export maximum 10k records
      skip: 0,
      includeDetails: true,
    };

    // Fetch logs
    const { logs } = await getAuditLogs(filters);

    // Convert to CSV
    const csv = convertToCSV(logs);

    // Create audit log for export action
    await createAuditLog({
      action: AUDIT_ACTIONS.EXPORT,
      entityType: AUDIT_ENTITIES.AUDIT_LOG,
      entityName: `Exported ${logs.length} audit logs`,
      performedBy: searchParams.get('exportedBy') || 'System',
      performedByEmail: searchParams.get('exportedByEmail') || null,
      details: {
        recordCount: logs.length,
        filters,
      },
      request,
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `audit-logs-${timestamp}.csv`;

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        message: 'Failed to export audit logs',
      },
      {
        status: 500,
      }
    );
  }
}
