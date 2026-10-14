import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { Seller } from '@/models/Seller';
import { Product } from '@/models/Product';

// 1. GET: Fetch all active products for this seller for the rapid batch editor
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const seller = await Seller.findOne({ userId: session.user.id }).lean();
    if (!seller) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }

    const products = await Product.find({
      $or: [
        { sellerId: seller._id },
        { sellerStoreName: seller.storeName }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = products.map((p: any) => {
      // Calculate total stock from variants
      let totalStock = 0;
      if (Array.isArray(p.variants) && p.variants.length > 0) {
        p.variants.forEach((v: any) => {
          if (Array.isArray(v.sizes)) {
            v.sizes.forEach((s: any) => {
              totalStock += s.stock || 0;
            });
          }
        });
      }

      return {
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        category: p.category,
        priceRupees: Math.round(p.price / 100),
        originalPriceRupees: Math.round(p.originalPrice / 100),
        stock: totalStock,
        status: p.status || 'ACTIVE',
        image: p.variants?.[0]?.images?.[0] || p.images?.[0] || '/pdp_hero_1.png',
      };
    });

    return NextResponse.json({ products: formatted, count: formatted.length });
  } catch (error) {
    console.error('Fetch bulk products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// 2. POST: Bulk import products parsed from CSV
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const seller = await Seller.findOne({ userId: session.user.id });
    if (!seller) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided for import' }, { status: 400 });
    }

    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      try {
        if (!row.name || !row.category) {
          errors.push(`Row ${i + 1}: Name and Category are required.`);
          continue;
        }

        const priceRupees = Number(row.price) || 999;
        const originalPriceRupees = Number(row.originalPrice) || priceRupees * 1.25;
        const stockCount = Number(row.stock) || 10;

        // Generate clean URL slug
        const baseSlug = (row.slug || row.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`;

        const newDoc = new Product({
          name: row.name.trim(),
          slug: uniqueSlug,
          category: row.category.trim(),
          description: row.description || `${row.name} handcrafted by master artisans for ${seller.storeName}.`,
          shortDescription: row.fabric ? `Fabric: ${row.fabric}` : 'Authentic Handcrafted Luxury',
          fabric: row.fabric || 'Pure Artisan Fabric',
          price: Math.round(priceRupees * 100),
          originalPrice: Math.round(originalPriceRupees * 100),
          sellerId: seller._id,
          sellerStoreName: seller.storeName,
          sellerSlug: seller.slug,
          status: 'ACTIVE',
          isActive: true,
          variants: [
            {
              colorName: row.color || 'Standard',
              colorHex: '#1C1C1A',
              images: row.image ? [row.image] : ['/pdp_hero_1.png'],
              sizes: [
                { size: 'S', stock: Math.ceil(stockCount / 4), sku: `${uniqueSlug}-S` },
                { size: 'M', stock: Math.ceil(stockCount / 4), sku: `${uniqueSlug}-M` },
                { size: 'L', stock: Math.ceil(stockCount / 4), sku: `${uniqueSlug}-L` },
                { size: 'XL', stock: Math.floor(stockCount / 4), sku: `${uniqueSlug}-XL` },
              ],
            },
          ],
        });

        await newDoc.save();
        createdProducts.push({ _id: newDoc._id.toString(), name: newDoc.name, slug: newDoc.slug });
      } catch (err: any) {
        console.error(`Error importing row ${i + 1}:`, err);
        errors.push(`Row ${i + 1} (${row.name || 'Unknown'}): ${err.message || 'Creation error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: createdProducts.length,
      errors,
      createdProducts,
    });
  } catch (error) {
    console.error('Bulk import POST error:', error);
    return NextResponse.json({ error: 'Bulk import failed' }, { status: 500 });
  }
}

// 3. PATCH: Batch update price and stock in-browser
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const seller = await Seller.findOne({ userId: session.user.id }).lean();
    if (!seller) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { updates } = body; // Array of { _id, priceRupees, originalPriceRupees, stock }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    let updatedCount = 0;

    for (const item of updates) {
      if (!item._id) continue;

      const product = await Product.findOne({
        _id: item._id,
        $or: [
          { sellerId: seller._id },
          { sellerStoreName: seller.storeName }
        ]
      });

      if (product) {
        if (typeof item.priceRupees === 'number' && item.priceRupees > 0) {
          product.price = Math.round(item.priceRupees * 100);
        }
        if (typeof item.originalPriceRupees === 'number' && item.originalPriceRupees > 0) {
          product.originalPrice = Math.round(item.originalPriceRupees * 100);
        }

        if (typeof item.stock === 'number' && item.stock >= 0) {
          // Distribute stock across sizes in variant 0
          if (product.variants?.[0]?.sizes?.length) {
            const sizeCount = product.variants[0].sizes.length;
            const perSize = Math.floor(item.stock / sizeCount);
            const remainder = item.stock % sizeCount;

            product.variants[0].sizes.forEach((s: any, idx: number) => {
              s.stock = perSize + (idx === 0 ? remainder : 0);
            });
          }
        }

        await product.save();
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated ${updatedCount} products.`,
    });
  } catch (error) {
    console.error('Batch PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}
