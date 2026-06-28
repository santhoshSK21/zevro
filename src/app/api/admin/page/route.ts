import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Page } from '../../../../models/Page';
import { assertAdminAccess } from '../../../../lib/adminAuth';

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { slug, title, status, blocks } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const page = await Page.findOneAndUpdate(
      { slug },
      { slug, title, status, blocks },
      { new: true, upsert: true }
    );

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      const pages = await Page.find().lean();
      return NextResponse.json(pages);
    }

    const page = await Page.findOne({ slug }).lean();
    if (!page) {
       return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
