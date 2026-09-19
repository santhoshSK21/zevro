import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import { Review } from '../../../../../models/Review';
import { assertAdminAccess } from '../../../../../lib/adminAuth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    const body = await request.json();
    
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(resolvedParams.id, { status: body.status }, { new: true });
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    const review = await Review.findByIdAndDelete(resolvedParams.id);
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
