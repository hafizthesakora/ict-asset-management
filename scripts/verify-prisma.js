// Quick verification script to check if Prisma client has auditLog model
import db from '../lib/db.js';

console.log('Checking Prisma client models...');
console.log('Available models:', Object.keys(db));
console.log('AuditLog model available:', db.auditLog ? '✅ YES' : '❌ NO');

if (db.auditLog) {
  console.log('AuditLog methods:', Object.keys(Object.getPrototypeOf(db.auditLog)));
}

process.exit(0);
