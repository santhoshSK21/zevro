import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Coupon } from '../../../../models/Coupon';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { code, cartValue } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }
    
    if (coupon.minOrderValue && cartValue < coupon.minOrderValue) {
      return NextResponse.json({ error: `Minimum purchase of ₹${coupon.minOrderValue / 100} required` }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }
    
    return NextResponse.json({
      valid: true,
      _id: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
