import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Category } from '../../../../models/Category';
import { Product } from '../../../../models/Product';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    await dbConnect();
    const body = await request.json();
    
    if (body.slug) {
      const existing = await Category.findOne({ slug: body.slug, _id: { $ne: resolvedParams.id } });
      if (existing) {
        return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
      }
    }

    const category = await Category.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    
    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate category name or slug' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const resolvedParams = await params;
    
    await dbConnect();
    
    const category = await Category.findById(resolvedParams.id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    // Check if products exist in this category
    // Since Product uses category string matching the slug or name
    const productsCount = await Product.countDocuments({ category: category.slug });
    
    // Also check if any subcategories exist
    const subcatsCount = await Category.countDocuments({ parent: category._id });

    if (productsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. ${productsCount} products are assigned to it.` 
      }, { status: 400 });
    }
    
    if (subcatsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. It has ${subcatsCount} subcategories.` 
      }, { status: 400 });
    }

    await Category.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
