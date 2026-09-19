import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Order } from '../../../models/Order';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.orderId || !body.email) {
      return NextResponse.json({ error: 'Order ID and Email are required' }, { status: 400 });
    }

    // Lookup order securely
    const order = await Order.findOne({ 
      $or: [{ orderId: body.orderId }, { _id: body.orderId }],
      'shippingAddress.email': body.email
    }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found or email does not match' }, { status: 404 });
    }

    // Format the response specifically for the tracking UI to avoid leaking too much
    const result = {
      id: order.orderId || order._id.toString(),
      status: order.status,
      estimatedDelivery: order.shipping?.estimatedDelivery 
        ? new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
        : 'To be announced',
      timeline: order.timeline.map((event: any) => ({
        status: event.status,
        message: event.message,
        time: new Date(event.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true, // we assume all logged timeline events are completed
      })),
      items: order.items.map((i: any) => ({
        name: i.name,
        qty: i.quantity,
        image: i.image,
        size: i.size,
        color: i.color
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
