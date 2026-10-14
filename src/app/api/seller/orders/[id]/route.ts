import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const order = await Order.findById(id).populate('userId', 'name email phone').lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    console.error('Error fetching single order:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status, trackingNumber, courierName, trackingUrl } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status) {
      order.status = status;
      
      // Update individual items fulfillmentStatus
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          if (status === 'shipped') {
            item.fulfillmentStatus = 'shipped';
            item.courierName = courierName || item.courierName;
            item.trackingNumber = trackingNumber || item.trackingNumber;
            item.trackingUrl = trackingUrl || item.trackingUrl;
            item.shippedAt = new Date();
          } else if (status === 'delivered') {
            item.fulfillmentStatus = 'delivered';
            item.deliveredAt = new Date();
          } else if (status === 'confirmed') {
            item.fulfillmentStatus = 'packing';
          }
        });
      }

      // Add timeline event
      order.timeline.push({
        status: status.toUpperCase(),
        message: status === 'shipped' 
          ? `Dispatched via ${courierName || 'Courier Partner'} (AWB: ${trackingNumber || 'Pending'})` 
          : `Order marked as ${status} by merchant fulfillment center`,
        location: 'Merchant Fulfillment Hub',
        timestamp: new Date(),
      });
    }

    if (trackingNumber || courierName) {
      order.shipping = {
        ...order.shipping,
        awbCode: trackingNumber || order.shipping?.awbCode,
        courierName: courierName || order.shipping?.courierName,
      };
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
