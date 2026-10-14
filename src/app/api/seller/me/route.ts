import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Seller from '@/models/Seller';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let seller = await Seller.findOne({ userId: session.user.id });

    // Fallback: If logged in as admin or user doesn't have a seller record yet, check if there's a primary single-client seller
    if (!seller && session.user.role === 'admin') {
      seller = await Seller.findOne({ isSingleClient: true });
    }

    if (!seller) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    // Aggregate quick dashboard stats for the seller
    const totalProducts = await Product.countDocuments({
      $or: [{ sellerId: seller._id }, { sellerId: { $exists: false } }], // include legacy store products for specific client
      isActive: true,
    });

    const lowStockThreshold = 5;
    const lowStockProducts = await Product.countDocuments({
      $or: [{ sellerId: seller._id }, { sellerId: { $exists: false } }],
      'variants.sizes.stock': { $lte: lowStockThreshold },
    });

    // Recent orders count
    const recentOrdersCount = await Order.countDocuments();

    return NextResponse.json({
      success: true,
      seller,
      stats: {
        totalProducts,
        lowStockProducts,
        recentOrdersCount,
        rating: seller.metrics?.rating || 5.0,
      },
    });
  } catch (err: any) {
    console.error('Error fetching seller profile:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let seller = await Seller.findOne({ userId: session.user.id });
    if (!seller && session.user.role === 'admin') {
      seller = await Seller.findOne({ isSingleClient: true });
    }

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      storeName,
      description,
      logo,
      banner,
      pickupAddress,
      businessDetails,
      bankDetails,
      settings,
    } = body;

    if (storeName) seller.storeName = storeName;
    if (description !== undefined) seller.description = description;
    if (logo) seller.logo = logo;
    if (banner) seller.banner = banner;

    if (pickupAddress) {
      seller.pickupAddress = {
        ...seller.pickupAddress,
        ...pickupAddress,
      };
    }

    if (businessDetails) {
      seller.businessDetails = {
        ...seller.businessDetails,
        ...businessDetails,
      };
    }

    if (bankDetails) {
      seller.bankDetails = {
        ...seller.bankDetails,
        ...bankDetails,
      };
    }

    if (settings) {
      seller.settings = {
        ...seller.settings,
        ...settings,
      };
    }

    await seller.save();

    return NextResponse.json({
      success: true,
      message: 'Seller profile updated successfully',
      seller,
    });
  } catch (err: any) {
    console.error('Error updating seller profile:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
