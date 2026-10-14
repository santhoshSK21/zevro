import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Seller } from '@/models/Seller';
import { ReturnRequest } from '@/models/ReturnRequest';

// 1. GET: Fetch user's return requests
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    const query: any = { userId: session.user.id };
    if (orderId) query.orderId = orderId;

    const returns = await ReturnRequest.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ returns });
  } catch (error) {
    console.error('Fetch returns error:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

// 2. POST: Customer files a return/exchange request
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const {
      orderId,
      itemSku,
      productId,
      type = 'RETURN',
      reason,
      details = '',
      exchangePreference,
      photos = [],
    } = body;

    if (!orderId || !reason || (!itemSku && !productId)) {
      return NextResponse.json({ error: 'Missing required return details' }, { status: 400 });
    }

    // Verify order belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId: session.user.id,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Find the item in the order
    const orderItem = order.items.find(
      (it: any) =>
        (itemSku && it.sku === itemSku) ||
        (productId && it.productId?.toString() === productId)
    );

    if (!orderItem) {
      return NextResponse.json({ error: 'Item not found in this order' }, { status: 404 });
    }

    // Check if return request already exists for this item
    const existing = await ReturnRequest.findOne({
      orderId: order._id,
      'item.productId': orderItem.productId,
      status: { $nin: ['REJECTED', 'COMPLETED', 'REFUNDED'] },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A return or exchange request is already active for this item' },
        { status: 400 }
      );
    }

    // Find seller store name
    let sellerStoreName = 'ZEVRO Signature Atelier';
    let sellerId = orderItem.sellerId;

    if (sellerId) {
      const seller = await Seller.findById(sellerId).lean();
      if (seller) sellerStoreName = seller.storeName;
    } else {
      const defaultSeller = await Seller.findOne().lean();
      if (defaultSeller) {
        sellerId = defaultSeller._id;
        sellerStoreName = defaultSeller.storeName;
      }
    }

    const returnRequest = new ReturnRequest({
      orderId: order._id,
      orderNumber: order.orderId || order._id.toString().slice(-6).toUpperCase(),
      sellerId,
      sellerStoreName,
      userId: session.user.id,
      userEmail: session.user.email || 'customer@zevro.luxury',
      userName: session.user.name || order.shippingAddress?.name || 'Valued Customer',
      userPhone: order.shippingAddress?.phone || '',
      item: {
        productId: orderItem.productId,
        name: orderItem.name,
        image: orderItem.image || '/pdp_hero_1.png',
        color: orderItem.color,
        size: orderItem.size,
        quantity: orderItem.quantity || 1,
        price: orderItem.priceAtPurchase || 0,
        sku: orderItem.sku,
      },
      type: type === 'EXCHANGE' ? 'EXCHANGE' : 'RETURN',
      reason,
      details,
      photos,
      exchangePreference,
      refund: {
        amount: (orderItem.priceAtPurchase || 0) * (orderItem.quantity || 1),
        status: 'pending',
      },
      status: 'REQUESTED',
      slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h SLA
    });

    await returnRequest.save();

    // Update order timeline
    order.timeline.push({
      status: type === 'EXCHANGE' ? 'exchange-requested' : 'return-requested',
      message: `Customer initiated a ${type.toLowerCase()} request for ${orderItem.name} (${reason})`,
      timestamp: new Date(),
    } as any);

    await order.save();

    return NextResponse.json({
      success: true,
      message: `${type === 'EXCHANGE' ? 'Exchange' : 'Return'} request submitted successfully. The merchant will review within 48 hours.`,
      returnRequest,
    });
  } catch (error) {
    console.error('Create return request error:', error);
    return NextResponse.json({ error: 'Failed to file return request' }, { status: 500 });
  }
}
