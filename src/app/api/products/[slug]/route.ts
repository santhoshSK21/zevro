import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Product } from '../../../../models/Product';
import { auth } from '../../../../auth';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const product = await Product.findOne({ slug: resolvedParams.slug }).lean();
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    const product = await Product.findOneAndUpdate({ slug: resolvedParams.slug }, body, { new: true });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    await Product.findOneAndDelete({ slug: resolvedParams.slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
