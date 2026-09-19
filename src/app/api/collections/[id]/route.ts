import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Collection } from '../../../../models/Collection';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const collection = await Collection.findById(resolvedParams.id).lean();

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Fetch collection error:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const body = await request.json();

    const updatedCollection = await Collection.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCollection);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    
    // Instead of hard delete, maybe just deactivate it, or if they want hard delete:
    const deletedCollection = await Collection.findByIdAndDelete(resolvedParams.id);
    if (!deletedCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Collection deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete collection' }, { status: 500 });
  }
}
