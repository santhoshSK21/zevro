import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Cart } from '../../../models/Cart';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const cart = await Cart.findOne({ userId: session.user.id }).lean();
    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const { items } = await request.json();
    
    let cart = await Cart.findOne({ userId: session.user.id });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ userId: session.user.id, items });
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}
