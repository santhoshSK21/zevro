import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import Seller from '@/models/Seller';
import Product from '@/models/Product';
import InventoryTransaction from '@/models/InventoryTransaction';

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const filter = searchParams.get('filter') || 'all'; // all, low, oos

    const query: any = {};
    if (seller) {
      query.$or = [{ sellerId: seller._id }, { sellerId: { $exists: false } }];
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .select('name slug category variants price originalPrice isActive status updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    // Flatten into SKU-level inventory rows
    const inventoryRows: any[] = [];
    products.forEach((prod: any) => {
      (prod.variants || []).forEach((v: any) => {
        (v.sizes || []).forEach((s: any) => {
          const stock = Number(s.stock || 0);
          const isLow = stock > 0 && stock <= 5;
          const isOos = stock === 0;

          if (filter === 'low' && !isLow) return;
          if (filter === 'oos' && !isOos) return;

          inventoryRows.push({
            productId: prod._id,
            productName: prod.name,
            productSlug: prod.slug,
            category: prod.category,
            variantId: v._id || v.colorName,
            colorName: v.colorName || 'Default',
            colorHex: v.colorHex || '#000000',
            image: v.images?.[0] || '',
            size: s.size,
            sku: s.sku || `${prod.slug}-${s.size}`,
            stock: stock,
            price: prod.price / 100,
            status: prod.status || 'ACTIVE',
            isLow,
            isOos,
          });
        });
      });
    });

    return NextResponse.json({
      success: true,
      count: inventoryRows.length,
      items: inventoryRows,
    });
  } catch (err: any) {
    console.error('Error fetching seller inventory:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, variantId, size, newStock, reason } = body;

    if (!productId || !size || newStock === undefined) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let foundSize: any = null;
    let oldStock = 0;

    for (const v of product.variants) {
      if (!variantId || String(v._id) === String(variantId) || v.colorName === variantId) {
        const s = v.sizes.find((sz: any) => sz.size === size);
        if (s) {
          foundSize = s;
          oldStock = s.stock || 0;
          s.stock = Math.max(0, Number(newStock));
          break;
        }
      }
    }

    if (!foundSize) {
      return NextResponse.json({ error: 'Size variant not found on product' }, { status: 404 });
    }

    await product.save();

    // Log Inventory Transaction
    try {
      await InventoryTransaction.create({
        productId: product._id,
        variantId: String(variantId || 'default'),
        size,
        sku: foundSize.sku,
        quantityChange: Number(newStock) - oldStock,
        type: Number(newStock) > oldStock ? 'STOCK_RECEIVED' : 'STOCK_ADJUSTMENT',
        reason: reason || 'Manual adjustment via Seller Portal',
        referenceType: 'Admin',
        performedBy: session.user.id,
      });
    } catch (logErr) {
      console.warn('Inventory log creation skipped:', logErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Stock updated successfully',
      updatedStock: foundSize.stock,
    });
  } catch (err: any) {
    console.error('Error updating seller inventory stock:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update stock' },
      { status: 500 }
    );
  }
}
