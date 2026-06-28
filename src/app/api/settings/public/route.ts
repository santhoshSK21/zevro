import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { StoreConfig } from '../../../../models/StoreConfig';

export async function GET() {
  try {
    await dbConnect();
    let config = await StoreConfig.findOne().lean();
    if (!config) {
      config = await StoreConfig.create({});
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
