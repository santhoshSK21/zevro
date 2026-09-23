import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Coupon } from '../../../../models/Coupon';

const DEFAULT_COUPONS = [
  {
    code: 'ZEVRO10',
    description: '10% exclusive discount on luxury atelier collection',
    type: 'percent',
    value: 10,
    minOrderValue: 0,     // No minimum order value
    maxDiscount: 200000,  // ₹2,000 max
    usageLimit: 10000,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'WELCOME10',
    description: '10% discount on first luxury purchase',
    type: 'percent',
    value: 10,
    minOrderValue: 99900, // ₹999
    maxDiscount: 100000,  // ₹1,000 max
    usageLimit: 10000,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'ZEVRO500',
    description: 'Flat ₹500 discount on orders above ₹2,999',
    type: 'fixed',
    value: 50000,         // ₹500
    minOrderValue: 299900, // ₹2,999
    maxDiscount: 50000,
    usageLimit: 5000,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'LUXE15',
    description: '15% exclusive discount for luxury club members',
    type: 'percent',
    value: 15,
    minOrderValue: 499900, // ₹4,999
    maxDiscount: 250000,  // ₹2,500 max
    usageLimit: 2000,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'FESTIVE20',
    description: '20% festive celebration discount',
    type: 'percent',
    value: 20,
    minOrderValue: 199900, // ₹1,999
    maxDiscount: 300000,  // ₹3,000 max
    usageLimit: 5000,
    usedCount: 0,
    isActive: true
  }
];

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { code, cartValue } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if coupon exists in DB
    let coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
    
    // Auto-seed default coupon into DB if it matches a known default
    if (!coupon) {
      const defaultCoupon = DEFAULT_COUPONS.find(c => c.code === cleanCode);
      if (defaultCoupon) {
        try {
          coupon = await Coupon.create(defaultCoupon);
        } catch (e) {
          coupon = await Coupon.findOne({ code: cleanCode });
        }
      }
    }
    
    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: `Coupon code '${cleanCode}' is invalid or inactive` }, { status: 400 });
    }
    
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }
    
    if (coupon.minOrderValue && cartValue < coupon.minOrderValue) {
      const minInRupees = Math.round(coupon.minOrderValue / 100);
      return NextResponse.json({ 
        error: `Minimum order value of ₹${minInRupees.toLocaleString('en-IN')} required for ${cleanCode}` 
      }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its maximum global usage limit' }, { status: 400 });
    }
    
    return NextResponse.json({
      valid: true,
      _id: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
      description: coupon.description,
      usedCount: coupon.usedCount || 0
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
