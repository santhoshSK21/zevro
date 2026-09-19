import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Product } from '../../../../models/Product';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();

    // Check by _id or fallback to slug
    let product;
    if (resolvedParams.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(resolvedParams.id).lean();
    } else {
      product = await Product.findOne({ slug: resolvedParams.id }).lean();
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Fetch product by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.price || body.price <= 0) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    // Sync status and isActive
    if (body.status) {
      body.isActive = (body.status === 'ACTIVE');
    } else if (body.isActive !== undefined) {
      body.status = body.isActive ? 'ACTIVE' : 'DRAFT';
    }

    const product = await Product.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    const product = await Product.findByIdAndDelete(resolvedParams.id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
