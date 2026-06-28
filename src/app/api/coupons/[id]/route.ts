import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Coupon } from '../../../../models/Coupon';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    const body = await request.json();
    
    if (body.code) body.code = body.code.toUpperCase();
    
    if (body.type === 'percent' && body.value > 100) {
      return NextResponse.json({ error: 'Percentage cannot exceed 100' }, { status: 400 });
    }
    
    if (body.value <= 0) {
      return NextResponse.json({ error: 'Discount value must be greater than 0' }, { status: 400 });
    }
    
    if (body.code) {
      const existing = await Coupon.findOne({ code: body.code, _id: { $ne: resolvedParams.id } });
      if (existing) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    
    return NextResponse.json(coupon);
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate coupon code' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    
    const coupon = await Coupon.findByIdAndDelete(resolvedParams.id);
    if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
