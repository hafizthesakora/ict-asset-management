import db from '@/lib/db';

/**
 * Create an audit log entry
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action performed (CREATE, UPDATE, DELETE, TRANSFER, ASSIGN, REVOKE, etc.)
 * @param {string} params.entityType - Type of entity (Item, People, Access, Warehouse, etc.)
 * @param {string} params.entityId - ID of the entity
 * @param {string} params.entityName - Name/title of the entity for display
 * @param {string} params.performedBy - Name of person who performed the action
 * @param {string} params.performedByEmail - Email of person who performed the action
 * @param {Object} params.details - Additional details (before/after values, notes, etc.)
 * @param {Object} params.request - Optional Next.js request object for IP and user agent
 */
export async function createAuditLog({
  action,
  entityType,
  entityId,
  entityName,
  performedBy,
  performedByEmail,
  details,
  request,
}) {
  try {
    const auditLog = await db.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        entityName,
        performedBy,
        performedByEmail,
        details: details || {},
        ipAddress: request
          ? request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'
          : null,
        userAgent: request ? request.headers.get('user-agent') : null,
      },
    });

    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error to prevent audit log failures from breaking main operations
    return null;
  }
}

/**
 * Get audit logs with filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.entityType - Filter by entity type
 * @param {string} filters.entityId - Filter by specific entity ID
 * @param {string} filters.action - Filter by action type
 * @param {string} filters.performedBy - Filter by performer name
 * @param {Date} filters.startDate - Filter by start date
 * @param {Date} filters.endDate - Filter by end date
 * @param {number} filters.limit - Limit number of results (default 100)
 * @param {number} filters.skip - Skip number of results for pagination
 */
export async function getAuditLogs(filters = {}) {
  const {
    entityType,
    entityId,
    action,
    performedBy,
    startDate,
    endDate,
    limit = 100,
    skip = 0,
  } = filters;

  const where = {};

  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  if (action) where.action = action;
  if (performedBy) where.performedBy = { contains: performedBy, mode: 'insensitive' };
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  try {
    const logs = await db.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });

    const total = await db.auditLog.count({ where });

    return { logs, total };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats() {
  try {
    const [totalLogs, actionsToday, recentActions] = await Promise.all([
      // Total logs count
      db.auditLog.count(),

      // Actions today
      db.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Recent actions by type
      db.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          action: true,
          entityType: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalLogs,
      actionsToday,
      recentActions,
    };
  } catch (error) {
    console.error('Error fetching audit log stats:', error);
    throw error;
  }
}
