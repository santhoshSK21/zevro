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
