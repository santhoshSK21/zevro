import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import Seller from '@/models/Seller';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let seller = await Seller.findOne({ userId: session.user.id });
    if (!seller && session.user.role === 'admin') {
      seller = await Seller.findOne({ isSingleClient: true });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'all';

    const query: any = {};
    if (seller) {
      query.$or = [{ sellerId: seller._id }, { sellerId: { $exists: false } }];
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status !== 'all') {
      if (status === 'ACTIVE') query.isActive = true;
      else if (status === 'INACTIVE') query.isActive = false;
      else query.status = status;
    }

    const products = await Product.find(query).sort({ updatedAt: -1 }).lean();

    const formatted = products.map((p: any) => {
      let totalStock = 0;
      let totalVariants = 0;
      (p.variants || []).forEach((v: any) => {
        (v.sizes || []).forEach((s: any) => {
          totalStock += Number(s.stock || 0);
          totalVariants++;
        });
      });

      return {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price / 100,
        originalPrice: (p.originalPrice || p.price) / 100,
        image: p.variants?.[0]?.images?.[0] || '',
        totalStock,
        totalVariants,
        isActive: p.isActive,
        status: p.status || (p.isActive ? 'ACTIVE' : 'DRAFT'),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      products: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching seller products:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, isActive, status } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (isActive !== undefined) {
      product.isActive = Boolean(isActive);
    }
    if (status) {
      product.status = status;
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product listing updated successfully',
      product,
    });
  } catch (err: any) {
    console.error('Error updating seller product:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
