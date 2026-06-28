import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

let MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function runSeed() {
  console.log('Seeding in-memory database with 200 products...');
  
  const categoryImages: Record<string, string[]> = {
    'western-wear': [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
      'https://images.unsplash.com/photo-1550614000-4b95f463cb1e?w=800&q=80',
      'https://images.unsplash.com/photo-1502716115624-b56ef3145155?w=800&q=80',
      'https://images.unsplash.com/photo-1485230895905-ef4a5009a632?w=800&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
      'https://images.unsplash.com/photo-1524041255072-7da0525d6b34?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    ],
    'ethnic-wear': [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1617261314958-3759a224f8d5?w=800&q=80',
      'https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=800&q=80',
      'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=800&q=80',
      'https://images.unsplash.com/photo-1613589886915-d9df35649a37?w=800&q=80',
      'https://images.unsplash.com/photo-1622396112932-a5ab066f3fb8?w=800&q=80',
    ],
    'indo-western': [
      'https://images.unsplash.com/photo-1509631179647-0c739ba73a16?w=800&q=80',
      'https://images.unsplash.com/photo-1621084288075-80252119eb49?w=800&q=80',
      'https://images.unsplash.com/photo-1624838612952-473d09a8eb6e?w=800&q=80',
      'https://images.unsplash.com/photo-1623864448259-c29013f9fec5?w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1606248232930-b742512a80f0?w=800&q=80',
    ],
    'accessories': [
      'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
      'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80',
    ]
  };

  const adjectives = ['Premium', 'Luxury', 'Ethereal', 'Classic', 'Modern', 'Vintage', 'Signature', 'Timeless', 'Artisan', 'Bespoke'];
  const materials = ['Silk', 'Cotton', 'Linen', 'Velvet', 'Chiffon', 'Georgette', 'Satin', 'Cashmere'];
  const nouns: Record<string, string[]> = {
    'western-wear': ['Blouse', 'Dress', 'Trousers', 'Gown', 'Jacket', 'Blazer', 'Skirt', 'Corset'],
    'ethnic-wear': ['Saree', 'Lehenga', 'Kurti Set', 'Anarkali', 'Sharara', 'Dupatta'],
    'indo-western': ['Drape Dress', 'Fusion Set', 'Cape Suit', 'Dhoti Pants', 'Palazzo Set'],
    'accessories': ['Necklace', 'Earrings', 'Handbag', 'Belt', 'Scarf', 'Clutch']
  };

  const categories = [
    { name: 'Western Wear', slug: 'western-wear' },
    { name: 'Ethnic Wear', slug: 'ethnic-wear' },
    { name: 'Indo-Western', slug: 'indo-western' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }

  const productsToInsert = [];
  for (const cat of categories) {
    for (let i = 0; i < 50; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const nns = nouns[cat.slug];
      const noun = nns[Math.floor(Math.random() * nns.length)];
      const name = `${adj} ${mat} ${noun}`.toUpperCase();

      const price = Math.floor(Math.random() * 1500000) + 200000;
      const op = price + Math.floor(Math.random() * 500000) + 100000;
      
      const images = categoryImages[cat.slug];
      const shuffled = [...images].sort(() => 0.5 - Math.random());
      const imgs = shuffled.slice(0, 2);
      
      productsToInsert.push({
        name: name,
        slug: `${cat.slug}-${i + 1}-${Date.now()}`,
        description: 'A beautiful luxury piece crafted for elegance. Premium quality fabric ensuring a comfortable fit. Perfect for any special occasion or modern editorial look.',
        shortDescription: 'Premium fashion wear.',
        category: cat.slug,
        subcategory: 'general',
        price: price,
        originalPrice: op,
        isFeatured: i < 3,
        isNewArrival: i < 5,
        variants: [
          {
            colorName: 'Standard',
            colorHex: '#000000',
            images: [imgs[0], imgs[0]], // Duplicate the first image to prevent random hover changes
            sizes: [
              { size: 'XS', stock: Math.floor(Math.random() * 10) },
              { size: 'S', stock: Math.floor(Math.random() * 15) },
              { size: 'M', stock: Math.floor(Math.random() * 10) },
              { size: 'L', stock: Math.floor(Math.random() * 5) }
            ]
          }
        ]
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log('In-memory database successfully seeded!');
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Fallback to in-memory MongoDB if placeholder is used
  if (MONGODB_URI.includes('USERNAME:PASSWORD') && process.env.NODE_ENV !== 'production') {
    if (!(global as any).mongod_v3) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      (global as any).mongod_v3 = await MongoMemoryServer.create();
      MONGODB_URI = (global as any).mongod_v3.getUri();
      console.log('Using in-memory MongoDB fallback:', MONGODB_URI);
      
      // We must connect to run the seed
      if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI as string, { bufferCommands: false }).then((mongoose) => {
          return mongoose;
        });
      }
      cached.conn = await cached.promise;
      
      // Auto-seed the memory server exactly once upon creation
      await runSeed();
      
      return cached.conn;
    }
    MONGODB_URI = (global as any).mongod_v3.getUri();
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
