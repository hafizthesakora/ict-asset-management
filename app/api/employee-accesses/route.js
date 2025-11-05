import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { createAuditLog } from '@/lib/auditLog';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/constants/auditConstants';

export async function POST(request) {
  try {
    const { accessItemId, peopleId, grantedBy, notes } = await request.json();

    // Check if access already exists
    const existingAccess = await db.employeeAccess.findFirst({
      where: {
        accessItemId,
        peopleId,
        status: 'active',
      },
    });

    if (existingAccess) {
      return NextResponse.json(
        {
          message: 'This access is already assigned to this employee',
        },
        {
          status: 409,
        }
      );
    }

    const employeeAccess = await db.employeeAccess.create({
      data: {
        accessItemId,
        peopleId,
        grantedBy,
        notes,
        status: 'active',
      },
      include: {
        accessItem: {
          include: {
            category: true,
          },
        },
        people: true,
      },
    });

    // Create audit log
    await createAuditLog({
      action: AUDIT_ACTIONS.GRANT_ACCESS,
      entityType: AUDIT_ENTITIES.EMPLOYEE_ACCESS,
      entityId: employeeAccess.id,
      entityName: `${employeeAccess.accessItem.name} - ${employeeAccess.people.title}`,
      performedBy: grantedBy,
      performedByEmail: null,
      details: {
        accessName: employeeAccess.accessItem.name,
        accessCategory: employeeAccess.accessItem.category.title,
        employeeName: employeeAccess.people.title,
        employeeEmail: employeeAccess.people.email,
        notes,
      },
      request,
    });

    return NextResponse.json(employeeAccess);
  } catch (error) {
    console.error('Error creating employee access:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to assign access',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const peopleId = request.nextUrl.searchParams.get('peopleId');
    const status = request.nextUrl.searchParams.get('status');

    const where = {};
    if (peopleId) where.peopleId = peopleId;
    if (status) where.status = status;

    const employeeAccesses = await db.employeeAccess.findMany({
      where,
      orderBy: {
        grantedDate: 'desc',
      },
      include: {
        accessItem: {
          include: {
            category: true,
          },
        },
        people: true,
      },
    });
    return NextResponse.json(employeeAccesses);
  } catch (error) {
    console.error('Error fetching employee accesses:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to fetch employee accesses',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, status, revokedBy, notes } = await request.json();

    const updateData = {
      status,
      notes,
    };

    if (status === 'revoked') {
      updateData.revokedDate = new Date();
      updateData.revokedBy = revokedBy;
    }

    const employeeAccess = await db.employeeAccess.update({
      where: { id },
      data: updateData,
      include: {
        accessItem: {
          include: {
            category: true,
          },
        },
        people: true,
      },
    });

    // Create audit log for revocation
    if (status === 'revoked') {
      await createAuditLog({
        action: AUDIT_ACTIONS.REVOKE_ACCESS,
        entityType: AUDIT_ENTITIES.EMPLOYEE_ACCESS,
        entityId: employeeAccess.id,
        entityName: `${employeeAccess.accessItem.name} - ${employeeAccess.people.title}`,
        performedBy: revokedBy,
        performedByEmail: null,
        details: {
          accessName: employeeAccess.accessItem.name,
          accessCategory: employeeAccess.accessItem.category.title,
          employeeName: employeeAccess.people.title,
          employeeEmail: employeeAccess.people.email,
          notes,
        },
        request,
      });
    }

    return NextResponse.json(employeeAccess);
  } catch (error) {
    console.error('Error updating employee access:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to update access',
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const employeeAccess = await db.employeeAccess.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(employeeAccess);
  } catch (error) {
    console.error('Error deleting employee access:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to delete access',
      },
      {
        status: 500,
      }
    );
  }
}
