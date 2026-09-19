import { NextResponse } from 'next/server';

// In-memory persistent store for POC demonstrations
let mockAdmins = [
  {
    id: 'adm-001',
    name: 'Santhosh Kumar',
    email: 'superadmin@zevro.in',
    role: 'Super Admin',
    status: 'Active',
    avatar: 'SK',
    permissions: ['all_access', 'billing', 'admin_management', 'system_config'],
    lastLogin: '2 minutes ago',
    createdAt: '2026-01-15'
  },
  {
    id: 'adm-002',
    name: 'Aisha Mehta',
    email: 'aisha.m@zevro.in',
    role: 'Store Manager',
    status: 'Active',
    avatar: 'AM',
    permissions: ['products_read_write', 'orders_manage', 'reports_view', 'theme_edit'],
    lastLogin: '3 hours ago',
    createdAt: '2026-02-10'
  },
  {
    id: 'adm-003',
    name: 'Vikram Sengupta',
    email: 'vikram.s@zevro.in',
    role: 'Inventory Lead',
    status: 'Active',
    avatar: 'VS',
    permissions: ['inventory_manage', 'orders_read', 'products_edit'],
    lastLogin: 'Yesterday',
    createdAt: '2026-03-01'
  },
  {
    id: 'adm-004',
    name: 'Neha Kapoor',
    email: 'neha.k@zevro.in',
    role: 'Customer Support Lead',
    status: 'Active',
    avatar: 'NK',
    permissions: ['orders_manage', 'customers_read', 'returns_process'],
    lastLogin: '5 hours ago',
    createdAt: '2026-04-12'
  },
  {
    id: 'adm-005',
    name: 'Devraj Chauhan',
    email: 'devraj.c@zevro.in',
    role: 'Marketing Specialist',
    status: 'Suspended',
    avatar: 'DC',
    permissions: ['promotions_manage', 'reports_view'],
    lastLogin: '18 days ago',
    createdAt: '2026-05-20'
  }
];

export async function GET() {
  return NextResponse.json({ admins: mockAdmins });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ error: 'Name, Email, and Role are required' }, { status: 400 });
    }

    const trimmedEmail = body.email.trim().toLowerCase();
    const initials = body.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

    // Persist to MongoDB User collection as admin
    try {
      const dbConnect = (await import('../../../../lib/mongodb')).default;
      const { User } = await import('../../../../models/User');
      const bcrypt = (await import('bcryptjs')).default;
      
      await dbConnect();
      const existing = await User.findOne({ email: trimmedEmail });
      
      if (!existing) {
        const defaultPassword = body.password || 'Admin@123';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(defaultPassword, salt);

        await User.create({
          name: body.name.trim(),
          email: trimmedEmail,
          passwordHash,
          role: 'admin',
          isActive: true
        });
      } else {
        existing.role = 'admin';
        await existing.save();
      }
    } catch (dbErr) {
      console.warn('Could not persist admin to MongoDB User collection:', dbErr);
    }

    const newAdmin = {
      id: `adm-${String(mockAdmins.length + 1).padStart(3, '0')}`,
      name: body.name,
      email: trimmedEmail,
      role: body.role,
      status: 'Active' as const,
      avatar: initials || 'AD',
      permissions: body.permissions || ['orders_read', 'products_read'],
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };

    mockAdmins.unshift(newAdmin);
    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, role, permissions } = body;

    const adminIndex = mockAdmins.findIndex(a => a.id === id);
    if (adminIndex === -1) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (status) mockAdmins[adminIndex].status = status;
    if (role) mockAdmins[adminIndex].role = role;
    if (permissions) mockAdmins[adminIndex].permissions = permissions;

    return NextResponse.json({ success: true, admin: mockAdmins[adminIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    }

    mockAdmins = mockAdmins.filter(a => a.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
