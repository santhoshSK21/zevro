import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Category } from '../../../models/Category';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET() {
  try {
    await dbConnect();
    const categoriesList = await Category.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json(categoriesList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }
    
    const existing = await Category.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }

    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate category name or slug' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
