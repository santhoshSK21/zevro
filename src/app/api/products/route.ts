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
    const fabrics = searchParams.get('fabrics') || searchParams.get('fabric');
    const occasions = searchParams.get('occasions') || searchParams.get('occasion');
    const paginateParam = searchParams.get('paginate');
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '16', 10)));
    const skip = (page - 1) * limit;
    
    const conditions: any[] = [];

    if (!admin) {
      conditions.push({ isActive: true, status: { $ne: 'ARCHIVED' } });
    } else if (status) {
      conditions.push({ status });
    }

    if (category && category !== 'all') {
      if (category === 'new-in') {
        conditions.push({ $or: [{ isNewArrival: true }, { category: 'new-in' }] });
      } else {
        conditions.push({ category });
      }
    }
    
    if (subcategory) {
      conditions.push({ subcategory: { $regex: new RegExp(`^${subcategory}$`, 'i') } });
    }

    if (collection) {
      conditions.push({ collections: collection });
    }
    
    // Price range filtering (in INR paise: 1 INR = 100 paise)
    const priceFilter: any = {};
    if (minPrice && !isNaN(Number(minPrice)) && Number(minPrice) > 0) {
      priceFilter.$gte = Number(minPrice) * 100;
    }
    if (maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0 && Number(maxPrice) < 100000) {
      priceFilter.$lte = Number(maxPrice) * 100;
    }
    if (Object.keys(priceFilter).length > 0) {
      conditions.push({ price: priceFilter });
    }

    if (sizes) {
      const sizeArr = sizes.split(',').map(s => s.trim()).filter(Boolean);
      if (sizeArr.length > 0) {
        conditions.push({
          'variants.sizes.size': { $in: sizeArr.map(s => new RegExp(`^${s}$`, 'i')) }
        });
      }
    }

    if (colors) {
      const colorArr = colors.split(',').map(c => c.trim()).filter(Boolean);
      if (colorArr.length > 0) {
        const colorPatterns: RegExp[] = [];
        colorArr.forEach(c => {
          const lower = c.toLowerCase();
          if (lower === 'black') colorPatterns.push(/black|onyx|noir/i);
          else if (lower === 'blue') colorPatterns.push(/blue|navy|indigo|sapphire|midnight/i);
          else if (lower === 'green') colorPatterns.push(/green|emerald|olive|sage|mint/i);
          else if (lower === 'red') colorPatterns.push(/red|crimson|maroon|ruby|burgundy/i);
          else if (lower === 'pink') colorPatterns.push(/pink|rose|blush|magenta|fuchsia|dust/i);
          else if (lower === 'gold') colorPatterns.push(/gold|zari|metallic|brass/i);
          else if (lower === 'ivory' || lower === 'white') colorPatterns.push(/ivory|white|pearl|cream|champagne/i);
          else colorPatterns.push(new RegExp(c, 'i'));
        });
        conditions.push({ 'variants.colorName': { $in: colorPatterns } });
      }
    }

    if (fabrics) {
      const fabricArr = fabrics.split(',').map(f => f.trim()).filter(Boolean);
      if (fabricArr.length > 0) {
        conditions.push({ fabric: { $in: fabricArr.map(f => new RegExp(f, 'i')) } });
      }
    }

    if (occasions) {
      const occasionArr = occasions.split(',').map(o => o.trim()).filter(Boolean);
      if (occasionArr.length > 0) {
        conditions.push({ occasion: { $in: occasionArr.map(o => new RegExp(o, 'i')) } });
      }
    }
    
    if (q) {
      conditions.push({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } }
        ]
      });
    }
    
    const query = conditions.length > 0 ? { $and: conditions } : {};
    
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


