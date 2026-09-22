import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { assertAdminAccess } from '../../../lib/adminAuth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('sub') || searchParams.get('subcategory');
    const collection = searchParams.get('collection');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const admin = searchParams.get('admin'); // flag to bypass isActive filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sizes = searchParams.get('sizes');
    const colors = searchParams.get('colors');
    const paginateParam = searchParams.get('paginate');
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '16', 10)));
    const skip = (page - 1) * limit;
    
    const query: any = {};

    if (!admin) {
      query.isActive = true;
      query.status = { $ne: 'ARCHIVED' };
    } else if (status) {
      query.status = status;
    }

    if (category && category !== 'all') {
      if (category === 'new-in') {
        query.$or = [{ isNewArrival: true }, { category: 'new-in' }];
      } else {
        query.category = category;
      }
    }
    
    if (subcategory) {
      query.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
    }

    if (collection) {
      query.collections = collection;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && Number(minPrice) > 0) query.price.$gte = Number(minPrice) * 100;
      if (maxPrice && Number(maxPrice) < 50000) query.price.$lte = Number(maxPrice) * 100;
    }

    if (sizes) {
      const sizeArr = sizes.split(',').map(s => s.trim()).filter(Boolean);
      if (sizeArr.length > 0) {
        query['variants.sizes.size'] = { $in: sizeArr };
      }
    }

    if (colors) {
      const colorArr = colors.split(',').map(c => c.trim()).filter(Boolean);
      if (colorArr.length > 0) {
        query['variants.colorName'] = { $in: colorArr };
      }
    }
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }
    
    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    if (sort === 'bestselling') sortQuery = { isBestseller: -1, createdAt: -1 };
    
    const totalCount = await Product.countDocuments(query);
    
    let queryBuilder = Product.find(query).sort(sortQuery).skip(skip).limit(limit);
    
    // Project fields to reduce payload for storefront
    if (!admin) {
      queryBuilder = queryBuilder.select('name slug price originalPrice category subcategory isFeatured isNewArrival isBestseller isActive images image variants fabric');
    }

    const products = await queryBuilder.lean();
    
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const hasMore = skip + products.length < totalCount;

    // For admin or explicit paginate requests or storefront infinite scroll
    if (admin || paginateParam === 'true' || searchParams.has('page') || searchParams.has('limit')) {
      return NextResponse.json({
        products: products || [],
        total: totalCount,
        page,
        pages: totalPages,
        hasMore
      });
    }

    // Default JSON payload including metadata for modern clients
    return NextResponse.json({
      products: products || [],
      total: totalCount,
      page,
      pages: totalPages,
      hasMore
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const body = await request.json();
    
    // Server validation
    if (!body.name || !body.price || body.price <= 0) {
      return NextResponse.json({ error: 'Valid product name and positive price are required' }, { status: 400 });
    }
    
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    // Sync status and isActive
    if (body.status) {
      body.isActive = (body.status === 'ACTIVE');
    } else if (body.isActive !== undefined) {
      body.status = body.isActive ? 'ACTIVE' : 'DRAFT';
    }

    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    let ids: string[] = [];

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id') || searchParams.get('ids');

    if (idParam) {
      ids = idParam.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      try {
        const body = await request.json();
        if (Array.isArray(body.ids)) ids = body.ids;
        else if (body.id) ids = [body.id];
      } catch (e) {}
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'Product ID(s) required' }, { status: 400 });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete products' }, { status: 500 });
  }
}


