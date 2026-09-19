import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Review } from '../../../../models/Review';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const reviews = await Review.find().sort({ createdAt: -1 }).populate('productId', 'name').lean();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
