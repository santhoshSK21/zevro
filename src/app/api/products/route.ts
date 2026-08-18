import { NextResponse } from 'next/server';
import { productsToInsert } from '../../../lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    
    let products = [...productsToInsert];

    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (q) {
      const query = q.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }
    
    if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
    
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

