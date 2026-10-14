import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import { Product } from '../../../../../models/Product';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    
    // Find active product by slug
    const product: any = await Product.findOne({ slug: resolvedParams.slug, isActive: true }).lean();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Attach sellerSlug if seller exists
    if (product.sellerId) {
      const { Seller } = await import('../../../../../models/Seller');
      const seller = await Seller.findById(product.sellerId).select('storeName slug').lean();
      if (seller) {
        product.sellerStoreName = seller.storeName;
        product.sellerSlug = seller.slug;
      }
    } else {
      product.sellerSlug = 'zevro-atelier';
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Fetch product by slug error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
