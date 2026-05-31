import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Order } from '../../../models/Order';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    
    const query = session.user.role === 'admin' ? {} : { userId: session.user.id };
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    // Allow guest checkout if no session, or link to user
    const userId = session?.user?.id || null;
    
    await dbConnect();
    const body = await request.json();
    
    const newOrder = await Order.create({
      ...body,
      userId,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
