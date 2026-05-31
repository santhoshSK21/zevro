import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Coupon } from '../../../models/Coupon';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { code, cartValue } = await request.json();
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 });
    
    if (new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
    }
    
    if (cartValue < coupon.minPurchase) {
      return NextResponse.json({ error: `Minimum purchase of ₹${coupon.minPurchase / 100} required` }, { status: 400 });
    }
    
    return NextResponse.json({
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
