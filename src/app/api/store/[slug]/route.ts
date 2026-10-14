import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Seller } from '@/models/Seller';
import { Product } from '@/models/Product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

    await dbConnect();

    // 1. Try finding seller by slug
    let seller = await Seller.findOne({ slug: cleanSlug }).lean();

    // Default flagship profile if slug is zevro-atelier or no seller found with that slug
    if (!seller && (cleanSlug === 'zevro-atelier' || cleanSlug === 'zevro-signature-atelier' || cleanSlug === 'default')) {
      const products = await Product.find({ isActive: true })
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(24)
        .lean();

      return NextResponse.json({
        seller: {
          storeName: 'ZEVRO Signature Atelier',
          slug: 'zevro-atelier',
          description: 'Official flagship couture and heritage artisanal creations direct from the Zevro design ateliers in Milan and Mumbai.',
          logo: '',
          banner: '',
          contactEmail: 'concierge@zevro.luxury',
          city: 'Mumbai',
          state: 'Maharashtra',
          isVerified: true,
          metrics: {
            rating: 4.9,
            ratingCount: 348,
            totalSales: 1250,
          },
          memberSince: '2024',
        },
        products: products.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          slug: p.slug,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          images: p.variants?.[0]?.images?.length ? p.variants[0].images : (p.images || ['/pdp_hero_1.png']),
          ratings: p.ratings || { average: 4.8, count: 24 },
          isFeatured: !!p.isFeatured,
          isBestseller: !!p.isBestseller,
        })),
        totalProducts: products.length,
      });
    }

    if (!seller) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // 2. Fetch products associated with this seller
    const products = await Product.find({
      $or: [
        { sellerId: seller._id },
        { sellerStoreName: seller.storeName }
      ],
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    // If seller has no specific products yet, fetch general sample products to make the brand storefront look full and rich
    let displayProducts = products;
    if (displayProducts.length === 0) {
      displayProducts = await Product.find({ isActive: true }).limit(8).lean();
    }

    return NextResponse.json({
      seller: {
        _id: seller._id.toString(),
        storeName: seller.storeName,
        slug: seller.slug,
        description: seller.description || `Welcome to ${seller.storeName}'s official collection on ZEVRO. Premium artisanal fashion, handcrafted elegance, and authentic heritage quality.`,
        logo: seller.logo || '',
        banner: seller.banner || '',
        contactEmail: seller.contactEmail,
        contactPhone: seller.contactPhone,
        city: seller.pickupAddress?.city || 'India',
        state: seller.pickupAddress?.state || '',
        isVerified: seller.status === 'APPROVED',
        metrics: {
          rating: seller.metrics?.rating || 4.9,
          ratingCount: seller.metrics?.ratingCount || 42,
          totalSales: seller.metrics?.totalOrders || 85,
        },
        memberSince: seller.createdAt ? new Date(seller.createdAt).getFullYear().toString() : '2024',
      },
      products: displayProducts.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        images: p.variants?.[0]?.images?.length ? p.variants[0].images : (p.images || ['/pdp_hero_1.png']),
        ratings: p.ratings || { average: 4.8, count: 18 },
        isFeatured: !!p.isFeatured,
        isBestseller: !!p.isBestseller,
      })),
      totalProducts: displayProducts.length,
    });
  } catch (error) {
    console.error('Fetch store public profile error:', error);
    return NextResponse.json({ error: 'Failed to load store' }, { status: 500 });
  }
}
