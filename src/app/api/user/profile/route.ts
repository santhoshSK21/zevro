import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Seller } from '@/models/Seller';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({
      $or: [
        { _id: session.user.id },
        { email: session.user.email }
      ]
    }).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let seller = null;
    if (user.sellerId) {
      seller = await Seller.findById(user.sellerId).lean();
    } else if (user.role === 'seller') {
      seller = await Seller.findOne({ userId: user._id }).lean();
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'customer',
        addresses: user.addresses || [],
        createdAt: user.createdAt,
      },
      seller: seller ? {
        id: seller._id.toString(),
        storeName: seller.storeName,
        businessName: seller.businessName,
        email: seller.email,
        phone: seller.phone,
        status: seller.status,
        gstin: seller.gstin || '',
        pan: seller.pan || '',
        pickupAddress: seller.pickupAddress || null,
      } : null,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, firstName, lastName, phone, storeName } = body;

    const user = await User.findOne({
      $or: [
        { _id: session.user.id },
        { email: session.user.email }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // If seller and storeName updated, sync seller record
    if (storeName && user.sellerId) {
      await Seller.findByIdAndUpdate(user.sellerId, { storeName });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
