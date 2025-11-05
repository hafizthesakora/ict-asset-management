import db from '@/lib/db';
import {
  validateAuditData,
  AUDIT_FILTERS,
  AUDIT_VALIDATION,
} from '@/lib/constants/auditConstants';

/**
 * In-memory cache for audit statistics
 * In production, use Redis or similar
 */
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get client IP address from request
 */
const getClientIp = (request) => {
  if (!request) return null;

  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  );
};

/**
 * Sanitize and truncate data
 */
const sanitizeData = (data) => {
  return {
    ...data,
    entityName: data.entityName?.substring(0, AUDIT_VALIDATION.MAX_ENTITY_NAME_LENGTH),
    performedBy: data.performedBy?.substring(0, AUDIT_VALIDATION.MAX_PERFORMED_BY_LENGTH),
    performedByEmail: data.performedByEmail?.substring(0, AUDIT_VALIDATION.MAX_EMAIL_LENGTH),
    ipAddress: data.ipAddress?.substring(0, AUDIT_VALIDATION.MAX_IP_LENGTH),
  };
};

/**
 * Create an audit log entry
 * @param {Object} params - Audit log parameters
 * @returns {Promise<Object|null>} Created audit log or null on error
 */
export async function createAuditLog({
  action,
  entityType,
  entityId = null,
  entityName = null,
  performedBy,
  performedByEmail = null,
  details = null,
  request = null,
}) {
  try {
    // Validate input
    const validation = validateAuditData({
      action,
      entityType,
      performedBy,
      performedByEmail,
      entityName,
    });

    if (!validation.isValid) {
      console.error('Audit log validation failed:', validation.errors);
      return null;
    }

    // Sanitize data
    const sanitizedData = sanitizeData({
      action,
      entityType,
      entityId,
      entityName,
      performedBy,
      performedByEmail,
      ipAddress: getClientIp(request),
      userAgent: request?.headers.get('user-agent') || null,
      details: details || {},
    });

    // Create audit log
    const auditLog = await db.auditLog.create({
      data: sanitizedData,
    });

    // Invalidate stats cache
    cache.delete('audit-stats');

    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Non-blocking: don't throw to prevent main operation failure
    return null;
  }
}

/**
 * Create multiple audit logs in batch
 * @param {Array<Object>} logs - Array of audit log data
 * @returns {Promise<Array>} Created audit logs
 */
export async function createAuditLogBatch(logs) {
  try {
    const validLogs = logs
      .filter((log) => validateAuditData(log).isValid)
      .map((log) => sanitizeData(log));

    if (validLogs.length === 0) {
      return [];
    }

    const auditLogs = await db.auditLog.createMany({
      data: validLogs,
      skipDuplicates: true,
    });

    // Invalidate stats cache
    cache.delete('audit-stats');

    return auditLogs;
  } catch (error) {
    console.error('Error creating batch audit logs:', error);
    return [];
  }
}

/**
 * Build where clause for filtering
 */
const buildWhereClause = (filters) => {
  const where = {};

  if (filters.entityType) {
    where.entityType = filters.entityType;
  }

  if (filters.entityId) {
    where.entityId = filters.entityId;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.performedBy) {
    where.performedBy = {
      contains: filters.performedBy,
      mode: 'insensitive',
    };
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.createdAt.lte = new Date(filters.endDate);
    }
  }

  return where;
};

/**
 * Get audit logs with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<{logs: Array, total: number, hasMore: boolean}>}
 */
export async function getAuditLogs(filters = {}) {
  try {
    const {
      entityType,
      entityId,
      action,
      performedBy,
      startDate,
      endDate,
      limit = AUDIT_FILTERS.DEFAULT_LIMIT,
      skip = AUDIT_FILTERS.DEFAULT_SKIP,
      includeDetails = true,
    } = filters;

    // Validate and cap limit
    const safeLimit = Math.min(
      Math.max(limit, 1),
      AUDIT_FILTERS.MAX_LIMIT
    );

    const where = buildWhereClause({
      entityType,
      entityId,
      action,
      performedBy,
      startDate,
      endDate,
    });

    // Select fields based on includeDetails flag
    const select = includeDetails
      ? undefined // Select all fields
      : {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          entityName: true,
          performedBy: true,
          performedByEmail: true,
          createdAt: true,
          // Exclude details, ipAddress, userAgent
        };

    // Fetch logs and total count in parallel
    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        select,
        orderBy: { createdAt: 'desc' },
        take: safeLimit + 1, // Fetch one extra to check if there are more
        skip,
      }),
      db.auditLog.count({ where }),
    ]);

    // Check if there are more results
    const hasMore = logs.length > safeLimit;
    const resultLogs = hasMore ? logs.slice(0, safeLimit) : logs;

    return {
      logs: resultLogs,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}

/**
 * Get audit log by ID
 */
export async function getAuditLogById(id) {
  try {
    return await db.auditLog.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    throw error;
  }
}

/**
 * Get audit logs for a specific entity
 */
export async function getAuditLogsForEntity(entityType, entityId, limit = 50) {
  try {
    return await db.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Error fetching entity audit logs:', error);
    throw error;
  }
}

/**
 * Get audit log statistics with caching
 */
export async function getAuditLogStats() {
  try {
    // Check cache first
    const cached = cache.get('audit-stats');
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    const monthStart = new Date(now.setMonth(now.getMonth() - 1));

    const [
      totalLogs,
      actionsToday,
      actionsThisWeek,
      actionsThisMonth,
      recentActions,
      actionBreakdown,
      entityBreakdown,
      topPerformers,
    ] = await Promise.all([
      // Total logs count
      db.auditLog.count(),

      // Actions today
      db.auditLog.count({
        where: { createdAt: { gte: todayStart } },
      }),

      // Actions this week
      db.auditLog.count({
        where: { createdAt: { gte: weekStart } },
      }),

      // Actions this month
      db.auditLog.count({
        where: { createdAt: { gte: monthStart } },
      }),

      // Recent actions (last 10)
      db.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          action: true,
          entityType: true,
          createdAt: true,
          performedBy: true,
        },
      }),

      // Action type breakdown
      db.auditLog.groupBy({
        by: ['action'],
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
      }),

      // Entity type breakdown
      db.auditLog.groupBy({
        by: ['entityType'],
        _count: { entityType: true },
        orderBy: { _count: { entityType: 'desc' } },
      }),

      // Top performers
      db.auditLog.groupBy({
        by: ['performedBy'],
        _count: { performedBy: true },
        orderBy: { _count: { performedBy: 'desc' } },
        take: 10,
      }),
    ]);

    const stats = {
      totalLogs,
      actionsToday,
      actionsThisWeek,
      actionsThisMonth,
      recentActions,
      actionBreakdown: actionBreakdown.map((item) => ({
        action: item.action,
        count: item._count.action,
      })),
      entityBreakdown: entityBreakdown.map((item) => ({
        entityType: item.entityType,
        count: item._count.entityType,
      })),
      topPerformers: topPerformers.map((item) => ({
        performer: item.performedBy,
        count: item._count.performedBy,
      })),
    };

    // Cache the results
    cache.set('audit-stats', {
      data: stats,
      timestamp: Date.now(),
    });

    return stats;
  } catch (error) {
    console.error('Error fetching audit log stats:', error);
    throw error;
  }
}

/**
 * Delete old audit logs (data retention)
 * @param {number} daysToKeep - Number of days to retain logs
 */
export async function deleteOldAuditLogs(daysToKeep = 365) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await db.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    // Invalidate cache
    cache.delete('audit-stats');

    return result;
  } catch (error) {
    console.error('Error deleting old audit logs:', error);
    throw error;
  }
}

/**
 * Search audit logs with full-text search
 */
export async function searchAuditLogs(searchTerm, limit = 50) {
  try {
    const logs = await db.auditLog.findMany({
      where: {
        OR: [
          { entityName: { contains: searchTerm, mode: 'insensitive' } },
          { performedBy: { contains: searchTerm, mode: 'insensitive' } },
          { performedByEmail: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  } catch (error) {
    console.error('Error searching audit logs:', error);
    throw error;
  }
}

/**
 * Clear audit log cache manually
 */
export function clearAuditCache() {
  cache.clear();
}
