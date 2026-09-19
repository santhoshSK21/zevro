import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import { Product } from '../../../../../models/Product';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    
    // Find active product by slug
    const product = await Product.findOne({ slug: resolvedParams.slug, isActive: true }).lean();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Fetch product by slug error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
