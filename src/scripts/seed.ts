import mongoose from 'mongoose';
import { Product } from '../models/Product';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const products = [
  {
    name: 'Banarasi Silk Saree in Deep Maroon',
    slug: 'banarasi-silk-saree-deep-maroon',
    description: 'A stunning pure Banarasi silk saree perfect for weddings.',
    category: 'ethnic-wear',
    price: 429900,
    originalPrice: 599900,
    fabric: 'Pure Banarasi Silk',
    variants: [
      {
        colorName: 'Deep Maroon',
        colorHex: '#800000',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
        sizes: [
          { size: 'Free Size', stock: 10, sku: 'BAN-MAR-FS' }
        ]
      }
    ],
    ratings: { average: 4.8, count: 120 },
    isFeatured: true,
    isBestseller: true,
    isActive: true,
  },
  {
    name: 'Heavy Embroidered Anarkali in Ivory',
    slug: 'heavy-embroidered-anarkali-ivory',
    description: 'Beautiful anarkali with intricate zari work.',
    category: 'ethnic-wear',
    price: 549900,
    originalPrice: 749900,
    fabric: 'Georgette',
    variants: [
      {
        colorName: 'Ivory',
        colorHex: '#FFFFF0',
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800'],
        sizes: [
          { size: 'S', stock: 5, sku: 'ANA-IVY-S' },
          { size: 'M', stock: 8, sku: 'ANA-IVY-M' }
        ]
      }
    ],
    ratings: { average: 4.5, count: 45 },
    isActive: true,
  },
  {
    name: 'Linen Co-ord Set in Warm Beige',
    slug: 'linen-coord-set-warm-beige',
    description: 'Relaxed fit linen co-ord for summer.',
    category: 'western-wear',
    price: 249900,
    originalPrice: 329900,
    fabric: 'Linen',
    variants: [
      {
        colorName: 'Warm Beige',
        colorHex: '#F5F5DC',
        images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'],
        sizes: [
          { size: 'M', stock: 15, sku: 'LIN-BEI-M' },
          { size: 'L', stock: 10, sku: 'LIN-BEI-L' }
        ]
      }
    ],
    ratings: { average: 4.2, count: 34 },
    isNewArrival: true,
    isActive: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Successfully seeded v2 products');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
