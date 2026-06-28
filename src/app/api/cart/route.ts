import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Cart } from '../../../models/Cart';
import { Product } from '../../../models/Product';
import { auth } from '../../../auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const cart = await Cart.findOne({ userId: session.user.id }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Hydrate cart with latest product details
    const populatedItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId).lean();
      if (!product || product.status !== 'active') continue;

      const variant = product.variants?.find((v: any) => String(v._id) === item.variantId) || product.variants?.[0];
      if (!variant) continue;
      
      const sizeObj = variant.sizes?.find((s: any) => s.size === item.size);
      if (!sizeObj || sizeObj.stock <= 0) continue;

      // Cap quantity to stock
      const validQuantity = Math.min(item.quantity, sizeObj.stock);
      
      const price = product.discountPrice > 0 ? product.discountPrice : product.basePrice;

      populatedItems.push({
        productId: String(product._id),
        variantId: item.variantId || String(variant._id),
        sku: item.sku || sizeObj.sku,
        name: product.name,
        image: product.images?.[0] || '',
        color: variant.color || 'Default',
        size: item.size,
        quantity: validQuantity,
        price,
        originalPrice: product.basePrice
      });
    }

    return NextResponse.json({ items: populatedItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const items = body.items || [];
    
    await dbConnect();
    
    // Save to DB (only minimal details needed for DB representation based on schema)
    const dbItems = items.map((i: any) => ({
      productId: i.productId,
      variantId: i.variantId,
      sku: i.sku,
      size: i.size,
      quantity: i.quantity,
      price: i.price
    }));
    
    let cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: session.user.id, items: dbItems });
    } else {
      cart.items = dbItems;
      await cart.save();
    }

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}
