import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Coupon } from '../../../models/Coupon';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET() {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    
    body.code = body.code.toUpperCase();
    
    if (body.type === 'percent' && body.value > 100) {
      return NextResponse.json({ error: 'Percentage cannot exceed 100' }, { status: 400 });
    }
    
    if (body.value <= 0) {
      return NextResponse.json({ error: 'Discount value must be greater than 0' }, { status: 400 });
    }

    const existing = await Coupon.findOne({ code: body.code });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
    }
    
    const newCoupon = await Coupon.create(body);
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate coupon code' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
