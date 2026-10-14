import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      storeName,
      description,
      businessDetails,
      pickupAddress,
      bankDetails,
    } = body;

    // Basic validations
    if (!storeName || !email || !pickupAddress || !bankDetails) {
      return NextResponse.json(
        { error: 'Missing mandatory fields (store name, email, pickup address, bank details)' },
        { status: 400 }
      );
    }

    if (!pickupAddress.contactPerson || !pickupAddress.phone || !pickupAddress.line1 || !pickupAddress.city || !pickupAddress.state || !pickupAddress.pincode) {
      return NextResponse.json(
        { error: 'Please provide complete pickup address details' },
        { status: 400 }
      );
    }

    if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
      return NextResponse.json(
        { error: 'Please provide complete bank account settlement details' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate unique slug
    let baseSlug = slugify(storeName) || 'store';
    let slug = baseSlug;
    let counter = 1;
    while (await Seller.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Check if user already exists
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // Check if user is already a seller
      const existingSeller = await Seller.findOne({ userId: user._id });
      if (existingSeller) {
        return NextResponse.json(
          { error: 'A seller account is already associated with this email address. Please sign in.' },
          { status: 400 }
        );
      }
    } else {
      // Create new user
      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        name: name || storeName,
        email: cleanEmail,
        phone: phone || pickupAddress.phone,
        passwordHash,
        role: 'seller',
        isActive: true,
        emailVerified: true,
      });
    }

    // Create the Seller profile
    const seller = await Seller.create({
      userId: user._id,
      storeName,
      slug,
      description: description || '',
      contactEmail: cleanEmail,
      contactPhone: phone || pickupAddress.phone,
      businessDetails: {
        legalName: businessDetails?.legalName || storeName,
        businessType: businessDetails?.businessType || 'individual',
        gstin: businessDetails?.gstin || '',
        pan: businessDetails?.pan || '',
        registeredAddress: businessDetails?.registeredAddress || {
          line1: pickupAddress.line1,
          line2: pickupAddress.line2 || '',
          city: pickupAddress.city,
          state: pickupAddress.state,
          pincode: pickupAddress.pincode,
          country: 'India',
        },
      },
      pickupAddress: {
        contactPerson: pickupAddress.contactPerson,
        phone: pickupAddress.phone,
        line1: pickupAddress.line1,
        line2: pickupAddress.line2 || '',
        city: pickupAddress.city,
        state: pickupAddress.state,
        pincode: pickupAddress.pincode,
        country: pickupAddress.country || 'India',
      },
      bankDetails: {
        accountHolderName: bankDetails.accountHolderName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode.toUpperCase().trim(),
        bankName: bankDetails.bankName,
        branchName: bankDetails.branchName || '',
        accountType: bankDetails.accountType || 'current',
      },
      status: 'APPROVED', // Pre-approved for single specific client
      isSingleClient: true,
      commissionRate: 0,
      approvedAt: new Date(),
    });

    // Update user with sellerId and seller role
    user.role = 'seller';
    user.sellerId = seller._id;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Seller account registered successfully',
      seller: {
        id: seller._id,
        storeName: seller.storeName,
        slug: seller.slug,
        status: seller.status,
      },
    });
  } catch (err: any) {
    console.error('Error registering seller:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while registering seller' },
      { status: 500 }
    );
  }
}
