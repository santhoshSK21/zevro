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
import { Product } from '../../../models/Product';
import { InventoryTransaction } from '../../../models/InventoryTransaction';
import { Coupon } from '../../../models/Coupon';
import { Cart } from '../../../models/Cart';

export async function POST(request: Request) {
  try {
    const session = await auth();
    // Require authentication for orders to map securely to the user
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

    const isCod = body.paymentMethod === 'cod';
    const isDemo = !!body.demoMode;
    const initialStatus = isCod || isDemo ? 'confirmed' : 'placed';
    const initialPaymentStatus = isCod ? 'cod-pending' : (isDemo ? 'paid' : 'pending');

    // Increment coupon usage for COD/demo bypass flows here
    if (pricing.couponCode && (isCod || isDemo)) {
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
        status: initialPaymentStatus,
        paidAt: isDemo ? new Date() : undefined
      },
      status: initialStatus,
      timeline: [{
        status: initialStatus,
        message: isCod ? 'Order confirmed with Cash on Delivery' : (isDemo ? 'Order placed in Demo Mode' : 'Order placed'),
        timestamp: new Date()
      }]
    });

    // For COD and Demo flows, deduct stock immediately and clear user cart
    if (isCod || isDemo) {
      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          try {
            await Product.updateOne(
              { 
                _id: item.productId, 
                "variants.sizes": { $elemMatch: { size: item.size, stock: { $gte: item.quantity } } } 
              },
              { 
                $inc: { "variants.$[].sizes.$[sizeElem].stock": -item.quantity } 
              },
              { 
                arrayFilters: [{ "sizeElem.size": item.size }] 
              }
            );

            await InventoryTransaction.create({
              productId: item.productId,
              variantId: item.variantId,
              size: item.size,
              sku: item.sku,
              quantityChange: -item.quantity,
              type: 'STOCK_SOLD',
              reason: `Sold in order ${orderId} (${isCod ? 'COD' : 'Demo'})`,
              referenceType: 'Order',
              referenceId: newOrder._id,
              performedBy: userId
            });
          } catch (invErr) {
            console.warn(`Inventory deduction warning for order ${orderId}:`, invErr);
          }
        }
      }

      await Cart.findOneAndDelete({ userId });
    }
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}


