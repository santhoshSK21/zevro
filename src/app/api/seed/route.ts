import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';

const baseProducts = [
  { name: 'LUXURY SILK ENSEMBLE', category: 'ethnic-wear', subcategory: 'sarees', price: 499900, op: 650000, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' },
  { name: 'CRISP WHITE SHIRT', category: 'western-wear', subcategory: 'tops', price: 299900, op: 350000, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80' },
  { name: 'PRINTED MAXI DRESS', category: 'western-wear', subcategory: 'dresses', price: 549900, op: 750000, img: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80' },
  { name: 'GEORGETTE ANARKALI', category: 'ethnic-wear', subcategory: 'kurtis', price: 899900, op: 1150000, img: 'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80' },
  { name: 'INDO-WESTERN DRAPE', category: 'indo-western', subcategory: 'dresses', price: 799900, op: 999900, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80' },
  { name: 'KUNDAN NECKLACE', category: 'accessories', subcategory: 'jewelry', price: 149900, op: 200000, img: 'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&q=80' }
];

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Create Categories
    const categories = [
      { name: 'Western Wear', slug: 'western-wear' },
      { name: 'Ethnic Wear', slug: 'ethnic-wear' },
      { name: 'Indo-Western', slug: 'indo-western' },
      { name: 'Accessories', slug: 'accessories' }
    ];
    for (const cat of categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
    }

    // Clear existing to avoid duplicates during test
    await Product.deleteMany({});
    
    // Generate 24 products
    const productsToInsert = [];
    for (let i = 0; i < 24; i++) {
      const base = baseProducts[i % baseProducts.length];
      productsToInsert.push({
        name: `${base.name} - ${i + 1}`,
        slug: `${base.category}-${base.subcategory}-${i + 1}`,
        description: 'A beautiful luxury piece crafted for elegance. Premium quality fabric ensuring a comfortable fit.',
        shortDescription: 'Premium fashion wear.',
        category: base.category,
        subcategory: base.subcategory,
        price: base.price,
        originalPrice: base.op,
        isFeatured: i < 6, // first 6 featured
        isNewArrival: i % 3 === 0, // every 3rd new arrival
        variants: [
          {
            colorName: 'Standard',
            colorHex: '#000000',
            images: [base.img, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'],
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

    await Product.insertMany(productsToInsert);

    return NextResponse.json({ success: true, message: 'Database seeded with 24 products' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
