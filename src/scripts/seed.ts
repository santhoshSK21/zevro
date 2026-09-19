import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

// High-quality premium fashion images from Unsplash
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

function generateProductName(category: string) {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const mat = materials[Math.floor(Math.random() * materials.length)];
  const nns = nouns[category];
  const noun = nns[Math.floor(Math.random() * nns.length)];
  return `${adj} ${mat} ${noun}`.toUpperCase();
}

function getRandomImages(category: string, count: number) {
  const images = categoryImages[category];
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seed() {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (MONGODB_URI?.includes('USERNAME:PASSWORD')) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    MONGODB_URI = mongod.getUri();
    console.log('Using in-memory MongoDB fallback for seed:', MONGODB_URI);
  }

  await mongoose.connect(MONGODB_URI as string);
  console.log('Connected to MongoDB');

  const categories = [
    { name: 'Western Wear', slug: 'western-wear' },
    { name: 'Ethnic Wear', slug: 'ethnic-wear' },
    { name: 'Indo-Western', slug: 'indo-western' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }
  console.log('Categories seeded');

  await Product.deleteMany({});
  
  const productsToInsert = [];
  
  // Generate 50 products per category
  for (const cat of categories) {
    for (let i = 0; i < 50; i++) {
      const name = generateProductName(cat.slug);
      const price = Math.floor(Math.random() * 1500000) + 200000; // Between 2000 and 17000 INR (*100)
      const op = price + Math.floor(Math.random() * 500000) + 100000;
      
      const imgs = getRandomImages(cat.slug, 2);
      
      productsToInsert.push({
        name: name,
        slug: `${cat.slug}-${i + 1}-${Date.now()}`,
        description: 'A beautiful luxury piece crafted for elegance. Premium quality fabric ensuring a comfortable fit. Perfect for any special occasion or modern editorial look.',
        shortDescription: 'Premium fashion wear.',
        category: cat.slug,
        subcategory: 'general',
        price: price,
        originalPrice: op,
        isActive: true,
        status: 'ACTIVE',
        isFeatured: i < 3, // first 3 of each category featured
        isNewArrival: i < 5, // first 5 of each category new
        variants: [
          {
            colorName: 'Standard',
            colorHex: '#000000',
            images: imgs,
            sizes: [
              { size: 'XS', stock: Math.floor(Math.random() * 10) + 5 },
              { size: 'S', stock: Math.floor(Math.random() * 15) + 5 },
              { size: 'M', stock: Math.floor(Math.random() * 10) + 5 },
              { size: 'L', stock: Math.floor(Math.random() * 5) + 5 }
            ]
          }
        ]
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log(`Seeded ${productsToInsert.length} products successfully!`);

  // Seed Admin user
  const { User } = require('../models/User');
  const bcrypt = require('bcryptjs');
  const adminEmail = 'admin@zevro.in';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await User.create({
      name: 'Zevro Admin',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    console.log('Default admin account created (admin@zevro.in / adminpassword)');
  }

  // Seed Store Config
  const { StoreConfig } = require('../models/StoreConfig');
  const existingConfig = await StoreConfig.findOne();
  if (!existingConfig) {
    await StoreConfig.create({
      storeName: 'Zevro POC',
      storeEmail: 'support@zevro.in',
      currency: 'INR',
      currencySymbol: '₹',
      demoMode: true,
      freeShippingThreshold: 500000,
      shippingFee: 9900
    });
    console.log('Default store configuration initialized');
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
