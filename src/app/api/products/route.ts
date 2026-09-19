import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const admin = searchParams.get('admin'); // flag to bypass isActive filter
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;
    
    const query: any = {};

    if (!admin) {
      query.isActive = true;
      query.status = { $ne: 'ARCHIVED' }; // fallback if status used
    } else if (status) {
      query.status = status;
    }

    if (category) query.category = category;
    if (collection) query.collections = collection; // assumes collection ID
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }
    
    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    
    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortQuery).skip(skip).limit(limit).lean();
    
    if (admin && searchParams.get('paginate') === 'true') {
      return NextResponse.json({
        products: products || [],
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      });
    }

    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Fetch products error:', error);
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
    
    // Sync status and isActive
    if (body.status) {
      body.isActive = (body.status === 'ACTIVE');
    } else if (body.isActive !== undefined) {
      body.status = body.isActive ? 'ACTIVE' : 'DRAFT';
    }

    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

