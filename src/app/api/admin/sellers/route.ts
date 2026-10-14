import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Seller from '@/models/Seller';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { storeName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
        { contactPhone: { $regex: search, $options: 'i' } },
        { 'businessDetails.legalName': { $regex: search, $options: 'i' } },
        { 'businessDetails.gstin': { $regex: search, $options: 'i' } },
      ];
    }

    const sellers = await Seller.find(filter)
      .populate('userId', 'name email phone role createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: sellers.length,
      sellers,
    });
  } catch (err: any) {
    console.error('Error fetching sellers for admin:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
