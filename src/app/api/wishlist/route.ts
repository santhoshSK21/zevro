import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Wishlist } from '../../../models/Wishlist';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const wishlist = await Wishlist.findOne({ userId: session.user.id }).lean();
    return NextResponse.json(wishlist || { products: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const { productId } = await request.json();
    
    let wishlist = await Wishlist.findOne({ userId: session.user.id });
    if (wishlist) {
      const index = wishlist.products.indexOf(productId);
      if (index > -1) {
        wishlist.products.splice(index, 1); // Remove
      } else {
        wishlist.products.push(productId); // Add
      }
      await wishlist.save();
    } else {
      wishlist = await Wishlist.create({ userId: session.user.id, products: [productId] });
    }
    
    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to modify wishlist' }, { status: 500 });
  }
}
