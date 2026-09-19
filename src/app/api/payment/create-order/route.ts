import { NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/razorpay';
import { auth } from '../../../../auth';
import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../models/Order';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }
    
    await dbConnect();
    const dbOrder = await Order.findOne({ _id: orderId, userId: session.user.id });
    
    if (!dbOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    if (dbOrder.payment.status !== 'pending') {
      return NextResponse.json({ error: 'Order payment is not pending' }, { status: 400 });
    }
    
    // Use the authoritative amount from the database
    const amount = dbOrder.pricing.total;
    const receipt = dbOrder.orderId;
    
    const order = await paymentService.createOrder(amount, receipt);
    
    // Save the Razorpay Order ID to our order for tracking
    dbOrder.payment.razorpayOrderId = order.id;
    await dbOrder.save();
    
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}

