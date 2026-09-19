import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { InventoryTransaction } from '../../../models/InventoryTransaction';
import { assertAdminAccess } from '../../../lib/adminAuth';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    let query: any = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }
    
    // We fetch products to see their inventory
    const products = await Product.find(query).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    
    const { productId, variantId, size, quantityChange, type, reason } = body;
    
    if (!productId || !variantId || !size || quantityChange === undefined || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    const variant = product.variants.id(variantId);
    if (!variant) return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    
    const sizeObj = variant.sizes.find((s: any) => s.size === size);
    if (!sizeObj) return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    
    const newStock = sizeObj.stock + Number(quantityChange);
    if (newStock < 0) {
      return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 });
    }
    
    // Atomic update
    await Product.updateOne(
      {
        _id: productId,
        'variants._id': variantId,
        'variants.sizes.size': size
      },
      {
        $inc: { 'variants.$[v].sizes.$[s].stock': Number(quantityChange) }
      },
      {
        arrayFilters: [
          { 'v._id': variantId },
          { 's.size': size }
        ]
      }
    );
    
    // Record transaction
    await InventoryTransaction.create({
      productId,
      variantId,
      size,
      sku: sizeObj.sku,
      quantityChange: Number(quantityChange),
      type,
      reason,
      referenceType: 'Admin',
      performedBy: session?.user?.id
    });
    
    return NextResponse.json({ success: true, newStock });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
