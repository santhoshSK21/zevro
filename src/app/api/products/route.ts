import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    
    let query: any = {};
    if (category) query.category = category;
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    
    const products = await Product.find(query).sort(sortOption).lean();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const body = await request.json();
    
    // Server validation
    if (!body.name || !body.price || body.price <= 0) {
      return NextResponse.json({ error: 'Valid product name and positive price are required' }, { status: 400 });
    }
    
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

