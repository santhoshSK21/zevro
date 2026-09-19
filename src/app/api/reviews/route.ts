import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Review } from '../../../models/Review';
import { Product } from '../../../models/Product';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    const query: any = productId ? { productId, status: 'APPROVED' } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    
    const review = await Review.create({
      ...body,
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      status: 'PENDING' // Requires admin approval
    });
    
    // Note: Average rating update usually happens when approved (via admin route or mongoose hook)
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
