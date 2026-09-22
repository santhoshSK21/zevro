import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { StoreConfig } from '../../../models/StoreConfig';

export async function GET() {
  try {
    await dbConnect();
    const config = await StoreConfig.findOne({}).lean();
    return NextResponse.json({
      theme: config?.customTheme || null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const theme = await request.json();
    
    if (!theme || !theme.colors) {
      return NextResponse.json({ error: 'Invalid theme structure' }, { status: 400 });
    }

    const updated = await StoreConfig.findOneAndUpdate(
      {},
      { $set: { customTheme: theme } },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      theme: updated.customTheme
    });
  } catch (error) {
    console.error('Save theme error:', error);
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
  }
}
