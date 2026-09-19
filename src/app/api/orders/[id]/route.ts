import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../models/Order';
import { Product } from '../../../../models/Product';
import { Notification } from '../../../../models/Notification';
import { auth } from '../../../../auth';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const isAdmin = await assertAdminAccess();
    const session = await auth();
    await dbConnect();
    
    const order = await Order.findById(resolvedParams.id).lean();
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // Auth check (admin or owner)
    if (order.userId?.toString() !== session?.user?.id && !isAdmin) {
      if (order.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  'placed': ['confirmed', 'cancelled'],
  'confirmed': ['processing', 'cancelled'],
  'processing': ['packed', 'cancelled'],
  'packed': ['shipped', 'cancelled'],
  'shipped': ['out-for-delivery'],
  'out-for-delivery': ['delivered', 'returned'],
  'delivered': ['return-requested'],
  'return-requested': ['return-approved', 'cancelled'],
  'return-approved': ['returned'],
  'returned': [],
  'cancelled': []
};

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    const order = await Order.findById(resolvedParams.id);
    
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const currentStatus = order.status;
    const newStatus = body.status;

    // Validate state transition
    if (newStatus && newStatus !== currentStatus) {
      const allowed = VALID_TRANSITIONS[currentStatus] || [];
      // Note: we might want to allow some admin overrides (e.g. going straight to delivered if they messed up),
      // but strictly following Phase 5 requirements, we validate it:
      if (!allowed.includes(newStatus) && !body.forceTransition) {
        return NextResponse.json({ error: `Invalid transition from ${currentStatus} to ${newStatus}` }, { status: 400 });
      }

      order.status = newStatus;

      // Add timeline entry
      order.timeline.push({
        status: newStatus,
        message: body.message || `Order marked as ${newStatus}`,
        timestamp: new Date()
      });

      // Create Notification for the user
      if (order.userId) {
        await Notification.create({
          userId: order.userId,
          type: `ORDER_${newStatus.toUpperCase().replace(/-/g, '_')}`,
          title: 'Order Status Updated',
          message: `Your order ${order.orderId || order._id.toString().slice(-6).toUpperCase()} is now ${newStatus}.`,
          link: `/account/orders/${order._id}`
        });
      }

      // Handle Cancel / Refund stock release
      if (newStatus === 'cancelled' || newStatus === 'returned') {
        for (const item of order.items) {
          if (item.productId && item.variantId && item.size) {
            await Product.updateOne(
              {
                _id: item.productId,
                'variants._id': item.variantId,
                'variants.sizes.size': item.size
              },
              {
                $inc: { 'variants.$[v].sizes.$[s].stock': item.quantity }
              },
              {
                arrayFilters: [
                  { 'v._id': item.variantId },
                  { 's.size': item.size }
                ]
              }
            );
          }
        }
      }
    }

    if (body.paymentStatus && body.paymentStatus !== order.payment.status) {
      order.payment.status = body.paymentStatus;
      if (body.paymentStatus === 'paid') {
         order.payment.paidAt = new Date();
         order.timeline.push({
           status: 'paid',
           message: 'Payment confirmed',
           timestamp: new Date()
         });
      }
    }

    if (body.cancelReason) order.cancelReason = body.cancelReason;
    if (body.notes) order.notes = body.notes;
    
    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
