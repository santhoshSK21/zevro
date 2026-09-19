import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Collection } from '../../../models/Collection';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    const query = admin ? {} : { isActive: true };
    const collections = await Collection.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Fetch collections error:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
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

    if (!body.name) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const newCollection = await Collection.create(body);
    return NextResponse.json(newCollection, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create collection' }, { status: 500 });
  }
}
