import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { StoreConfig } from '../../../models/StoreConfig';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET() {
  try {
    await dbConnect();
    let config = await StoreConfig.findOne().lean();
    if (!config) {
      // Create default if none exists
      config = await StoreConfig.create({});
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const body = await request.json();
    
    // Basic validation
    if (body.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.supportEmail)) {
      return NextResponse.json({ error: 'Invalid support email' }, { status: 400 });
    }
    if (body.freeShippingThreshold < 0 || body.shippingCharge < 0) {
      return NextResponse.json({ error: 'Shipping values must be positive' }, { status: 400 });
    }
    
    // Check URLs
    const urlFields = ['storeLogoUrl', 'instagramUrl', 'facebookUrl', 'xUrl', 'pinterestUrl'];
    for (const field of urlFields) {
      if (body[field] && !body[field].startsWith('http')) {
        return NextResponse.json({ error: `Invalid URL for ${field}` }, { status: 400 });
      }
    }

    let config = await StoreConfig.findOne();
    if (!config) {
      config = await StoreConfig.create(body);
    } else {
      config = await StoreConfig.findByIdAndUpdate(config._id, body, { new: true });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
