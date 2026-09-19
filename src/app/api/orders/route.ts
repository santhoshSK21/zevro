import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Order } from '../../../models/Order';
import { auth } from '../../../auth';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    const session = await auth();
    
    if (!isAdmin && !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const query = isAdmin ? {} : { userId: session?.user?.id };
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

import { calculateOrderTotals } from '../../../lib/commerce';

export async function POST(request: Request) {
  try {
    const session = await auth();
    // Require authentication for Phase 2 orders to map securely to the user
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;
    
    await dbConnect();
    const body = await request.json();
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    
    // Use the commerce service to securely calculate all totals
    let pricing;
    try {
      pricing = await calculateOrderTotals(body.items, body.couponCode);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    
    // Generate ZEVRO Order ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ZEVRO-${year}-${randomNum}`;
    
    // Map validated items for the order schema
    const orderItems = pricing.items.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      priceAtPurchase: item.price,
      mrpAtPurchase: item.originalPrice,
      sku: item.sku
    }));

    // Increment coupon usage ONLY for COD/demo bypass flows here.
    // Real Razorpay flows will increment in /api/payment/verify
    if (pricing.couponCode && (body.paymentMethod === 'cod' || body.demoMode)) {
      const { Coupon } = require('../../../models/Coupon');
      await Coupon.findOneAndUpdate(
        { code: pricing.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }
    
    const newOrder = await Order.create({
      orderId,
      userId,
      items: orderItems,
      shippingAddress: body.shippingAddress,
      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        couponCode: pricing.couponCode,
        couponDiscount: pricing.couponDiscount,
        shippingCharge: pricing.shippingCharge,
        gst: pricing.tax,
        total: pricing.total
      },
      payment: {
        method: body.paymentMethod || 'razorpay',
        status: 'pending'
      },
      status: 'pending',
      timeline: [{
        status: 'placed',
        message: 'Order created',
        timestamp: new Date()
      }]
    });
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

