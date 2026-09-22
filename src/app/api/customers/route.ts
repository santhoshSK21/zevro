import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { User } from '../../../models/User';
import { Order } from '../../../models/Order';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    
    // Fetch all customers
    const customers = await User.find({ role: 'customer' }).lean();
    
    // Aggregate order stats per customer
    const orderStats = await Order.aggregate([
      { $match: { userId: { $in: customers.map((c: any) => c._id) } } },
      { $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpend: { $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, '$pricing.total', 0] } },
          lastOrder: { $max: '$createdAt' }
      }}
    ]);
    
    // Merge stats with customers
    const result = customers.map((c: any) => {
      const stats = orderStats.find((s: any) => s._id.toString() === c._id.toString()) || { orderCount: 0, totalSpend: 0, lastOrder: null };
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        createdAt: c.createdAt,
        orderCount: stats.orderCount,
        totalSpend: stats.totalSpend,
        lastOrder: stats.lastOrder
      };
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const bcrypt = (await import('bcryptjs')).default;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'Customer@123', salt);

    const newCustomer = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      phone: phone || '',
      passwordHash,
      role: 'customer',
      isActive: true
    });

    return NextResponse.json({
      success: true,
      customer: {
        _id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        createdAt: newCustomer.createdAt,
        orderCount: 0,
        totalSpend: 0,
        lastOrder: null
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create customer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    let ids: string[] = [];

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id') || searchParams.get('ids');

    if (idParam) {
      ids = idParam.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) ids = body.ids;
        else if (body.id) ids = [body.id];
      } catch (e) {}
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'Customer ID(s) required' }, { status: 400 });
    }

    const result = await User.deleteMany({ _id: { $in: ids }, role: 'customer' });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Delete customer error:', error);
    return NextResponse.json({ error: 'Failed to delete customer(s)' }, { status: 500 });
  }
}


