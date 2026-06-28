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

export async function POST(request: Request) {
  try {
    const session = await auth();
    // Allow guest checkout if no session, or link to user
    const userId = session?.user?.id || null;
    
    await dbConnect();
    const body = await request.json();
    
    // Stock validation
    if (body.items && body.items.length > 0) {
      const { Product } = require('../../../models/Product');
      for (const item of body.items) {
        const product = await Product.findById(item.productId).lean();
        if (!product) return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
        
        const variant = product.variants?.[0];
        const sizeObj = variant?.sizes?.find((s: any) => s.size === item.size);
        if (!sizeObj || sizeObj.stock < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for ${item.name} (Size: ${item.size})` }, { status: 400 });
        }
      }
    }
    
    // Coupon validation and usage increment
    if (body.pricing?.couponCode) {
      const { Coupon } = require('../../../models/Coupon');
      const coupon = await Coupon.findOne({ code: body.pricing.couponCode, isActive: true });
      
      if (!coupon) return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 });
      if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
        return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
      }
      if (coupon.minOrderValue && body.pricing.subtotal < coupon.minOrderValue) {
        return NextResponse.json({ error: 'Minimum order requirement not met for coupon' }, { status: 400 });
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
      }
      
      // Increment usage count ONLY for COD or demo bypass flows here.
      // Real Razorpay flows will increment in /api/payment/verify
      if (body.paymentMethod === 'cod' || body.demoMode) {
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }
    
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
